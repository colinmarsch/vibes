package com.example.planapp.android

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val apiKeyInput = findViewById<EditText>(R.id.apiKeyInput)
        val saveButton = findViewById<Button>(R.id.saveButton)
        val statusText = findViewById<TextView>(R.id.statusText)

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
        }

        saveButton.setOnClickListener {
            val candidate = apiKeyInput.text.toString().trim()
            if (candidate.isBlank()) {
                statusText.text = getString(R.string.empty_key_error)
                return@setOnClickListener
            }

            securePrefs.edit().putString(API_KEY_PREF, candidate).apply()
            statusText.text = getString(R.string.key_saved)
        }
    }

    companion object {
        private const val API_KEY_PREF = "openai_api_key"
    }
}
