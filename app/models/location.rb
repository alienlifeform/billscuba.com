class Location < ActiveRecord::Base
  attr_accessible :title, :short_desc, :long_desc, :city, :region, :country, :geography, :population, :image_1, :image_2, :created_at, :updated_at, :activities, :distance_to_hospital, :distance_to_airport, :internet_speed, :climate, :amenities, :expat_population, :health_care, :distance_to_international_school, :kids_friendliness, :quaintness, :interesting_activities_events, :liberal_or_conservative, :same_sex_friendly, :religions, :nightlife, :distance_to_nightlife, :nightlife_index, :province, :elevation, :distance_to_city
  has_many :factors_locations
  has_many :factors, :through => :factors_locations
end