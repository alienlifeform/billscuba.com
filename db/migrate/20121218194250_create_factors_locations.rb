class CreateFactorsLocations < ActiveRecord::Migration
  def change
    create_table :factors_locations do |t|
      t.integer :factor_id
      t.integer :location_id
      t.integer :value
      t.text :description

      t.timestamps
    end
  end
end
