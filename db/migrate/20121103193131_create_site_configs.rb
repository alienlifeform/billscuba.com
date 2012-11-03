class CreateSiteConfigs < ActiveRecord::Migration
  def change
    create_table :site_configs do |t|
      t.string :title
      t.text :desc
      t.string :logo
      t.text :contact_us_blurb

      t.timestamps
    end
  end
end
