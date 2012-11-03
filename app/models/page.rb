class Page < ActiveRecord::Base
  attr_accessible :main_area_1, :main_area_2, :main_area_3, 
  :side_area_1, :side_area_2, :side_area_3, 
  :template, :title, :top_nav_links
end
