class AddDistanceToCityToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :distance_to_city, :text
  end
end
