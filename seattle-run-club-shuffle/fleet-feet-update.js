const fleetFeetClub = clubs.find((club) => club.name === "Fleet Feet Seattle Run Club");

if (fleetFeetClub) {
  fleetFeetClub.neighborhood = "Ballard";
  fleetFeetClub.days = ["Tuesday"];
  fleetFeetClub.schedule = ["Tuesday · 6:00 PM community run from the Ballard store"];
  fleetFeetClub.source = "https://www.fleetfeet.com/s/seattle/locations";
  fleetFeetClub.location = {
    label: "Fleet Feet Seattle — Ballard (5404 22nd Ave NW)",
    lat: 47.6688,
    lng: -122.3849
  };

  render();
}
