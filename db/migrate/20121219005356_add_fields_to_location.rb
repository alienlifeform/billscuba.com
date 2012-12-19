class AddFieldsToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :activities, :text
    add_column :locations, :distance_to_hospital, :text
    add_column :locations, :distance_to_airport, :text
    add_column :locations, :internet_speed, :text
    add_column :locations, :climate, :text
    add_column :locations, :amenities, :text
    add_column :locations, :expat_population, :text
    add_column :locations, :health_care, :text
    add_column :locations, :distance_to_international_school, :text
    add_column :locations, :kids_friendliness, :text
    add_column :locations, :quaintness, :text
    add_column :locations, :interesting_activities_events, :text
    add_column :locations, :liberal_or_conservative, :text
    add_column :locations, :same_sex_friendly, :text
    add_column :locations, :religions, :text
    add_column :locations, :nightlife, :text
    add_column :locations, :distance_to_nightlife, :text
    add_column :locations, :nightlife_index, :integer

    # Elevation,Hobbies and Activities,Distance from Major Hospital,Travel Time from Quayaquil or 
    # Quito,Distance to Nearest Airport,Internet Speed,Climate,Amenities,Expat Population,Health Care,
    # Distance to major hospital,Distance from International School,Kids Friendlyness,Quaintness,
    # Interesting Activities/Events,Liberal vs. conservative,Same Sex Friendly,Religions,
    # Nightlife (itself),Proximity to nightlife center,Nightlife Total

  end
end
