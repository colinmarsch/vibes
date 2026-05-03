package com.example.planapp.android

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    private lateinit var authScreen: View
    private lateinit var goalsScreen: View
    private lateinit var goalsRecyclerView: RecyclerView
    private lateinit var emptyStateText: TextView

    private val goals = mutableListOf<Goal>()
    private lateinit var goalsAdapter: GoalsAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        authScreen = findViewById(R.id.authScreen)
        goalsScreen = findViewById(R.id.goalsScreen)
        goalsRecyclerView = findViewById(R.id.goalsRecyclerView)
        emptyStateText = findViewById(R.id.emptyGoalsText)

        val apiKeyInput = findViewById<EditText>(R.id.apiKeyInput)
        val saveButton = findViewById<Button>(R.id.saveButton)
        val statusText = findViewById<TextView>(R.id.statusText)
        val addGoalButton = findViewById<Button>(R.id.addGoalButton)

        goalsAdapter = GoalsAdapter(goals)
        goalsRecyclerView.layoutManager = LinearLayoutManager(this)
        goalsRecyclerView.adapter = goalsAdapter

        val masterKey = MasterKey.Builder(this)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        val securePrefs = EncryptedSharedPreferences.create(
            this,
            "plan_app_secure_prefs",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )

        val existingKey = securePrefs.getString(API_KEY_PREF, null)
        if (!existingKey.isNullOrBlank()) {
            apiKeyInput.setText(existingKey)
            statusText.text = getString(R.string.key_loaded)
            showGoalsScreen()
        } else {
            showAuthScreen()
        }

        loadGoals()

        saveButton.setOnClickListener {
            val candidate = apiKeyInput.text.toString().trim()
            if (candidate.isBlank()) {
                statusText.text = getString(R.string.empty_key_error)
                return@setOnClickListener
            }

            securePrefs.edit().putString(API_KEY_PREF, candidate).apply()
            statusText.text = getString(R.string.key_saved)
            showGoalsScreen()
        }

        addGoalButton.setOnClickListener {
            showCreateGoalDialog()
        }

        updateGoalsUi()
    }

    private fun showAuthScreen() {
        authScreen.visibility = View.VISIBLE
        goalsScreen.visibility = View.GONE
    }

    private fun showGoalsScreen() {
        authScreen.visibility = View.GONE
        goalsScreen.visibility = View.VISIBLE
    }

    private fun showCreateGoalDialog() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_goal, null)
        val titleInput = dialogView.findViewById<EditText>(R.id.goalTitleInput)
        val summaryInput = dialogView.findViewById<EditText>(R.id.goalSummaryInput)
        val contextInput = dialogView.findViewById<EditText>(R.id.goalContextInput)

        AlertDialog.Builder(this)
            .setTitle(R.string.create_goal)
            .setView(dialogView)
            .setPositiveButton(R.string.save_goal) { _, _ ->
                val title = titleInput.text.toString().trim()
                if (title.isBlank()) {
                    return@setPositiveButton
                }

                val goal = Goal(
                    title = title,
                    summary = summaryInput.text.toString().trim(),
                    context = contextInput.text.toString().trim()
                )
                goals.add(goal)
                saveGoals()
                updateGoalsUi()
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun loadGoals() {
        goals.clear()
        val raw = getSharedPreferences(GOALS_PREFS, MODE_PRIVATE).getString(GOALS_KEY, null)
        if (raw.isNullOrBlank()) return

        val jsonArray = JSONArray(raw)
        for (index in 0 until jsonArray.length()) {
            val item = jsonArray.optJSONObject(index) ?: continue
            goals.add(
                Goal(
                    title = item.optString("title"),
                    summary = item.optString("summary"),
                    context = item.optString("context")
                )
            )
        }
    }

    private fun saveGoals() {
        val jsonArray = JSONArray()
        goals.forEach { goal ->
            jsonArray.put(
                JSONObject().apply {
                    put("title", goal.title)
                    put("summary", goal.summary)
                    put("context", goal.context)
                }
            )
        }

        getSharedPreferences(GOALS_PREFS, MODE_PRIVATE)
            .edit()
            .putString(GOALS_KEY, jsonArray.toString())
            .apply()
    }

    private fun updateGoalsUi() {
        goalsAdapter.notifyDataSetChanged()
        val hasGoals = goals.isNotEmpty()
        emptyStateText.visibility = if (hasGoals) View.GONE else View.VISIBLE
        goalsRecyclerView.visibility = if (hasGoals) View.VISIBLE else View.GONE
    }

    companion object {
        private const val API_KEY_PREF = "openai_api_key"
        private const val GOALS_PREFS = "plan_app_goals"
        private const val GOALS_KEY = "goals"
    }
}

data class Goal(
    val title: String,
    val summary: String,
    val context: String
)

class GoalsAdapter(private val goals: List<Goal>) : RecyclerView.Adapter<GoalsAdapter.GoalViewHolder>() {

    class GoalViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val titleText: TextView = view.findViewById(R.id.goalTitleText)
        val summaryText: TextView = view.findViewById(R.id.goalSummaryText)
        val contextText: TextView = view.findViewById(R.id.goalContextText)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GoalViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_goal, parent, false)
        return GoalViewHolder(view)
    }

    override fun onBindViewHolder(holder: GoalViewHolder, position: Int) {
        val goal = goals[position]
        holder.titleText.text = goal.title
        holder.summaryText.text = goal.summary
        holder.contextText.text = goal.context
    }

    override fun getItemCount(): Int = goals.size
}
