class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :title
      t.text :top_nav_links
      t.text :main_area_1
      t.text :main_area_2
      t.text :main_area_3
      t.text :side_area_1
      t.text :side_area_2
      t.text :side_area_3
      t.string :template

      t.timestamps
    end
  end
end
