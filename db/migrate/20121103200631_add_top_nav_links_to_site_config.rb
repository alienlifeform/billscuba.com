class AddTopNavLinksToSiteConfig < ActiveRecord::Migration
  def change
    add_column :site_configs, :top_nav_links, :text
    add_column :site_configs, :footer_links, :text
  end
end
