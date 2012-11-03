class Location < ActiveRecord::Base
  attr_accessible :city, :country, :geography, :image_1, :image_2, :long_desc, :population, :region, :short_desc, :title
end
