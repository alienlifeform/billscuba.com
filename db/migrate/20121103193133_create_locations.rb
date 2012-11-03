class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :title
      t.text :short_desc
      t.text :long_desc
      t.string :city
      t.string :region
      t.string :country
      t.string :geography
      t.string :population
      t.string :image_1
      t.string :image_2

      t.timestamps
    end
  end
end
