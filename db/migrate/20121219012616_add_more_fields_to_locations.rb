class AddMoreFieldsToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :province, :text
    add_column :locations, :elevation, :text
  end
end
