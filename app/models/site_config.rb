class SiteConfig < ActiveRecord::Base
  attr_accessible :contact_us_blurb, :desc, :logo, :title, :top_nav_links, :footer_links

  @title = nil
  @desc = nil
  @logo = nil
  @contect_us_blurb = nil
  @top_nav_links = nil
  @footer_links = nil

  def self.top_nav_links
    @top_nav_links = @top_nav_links.present? ? @top_nav_links : self.find(1).top_nav_links
  end
  def self.footer_links
    @footer_links = @footer_links.present? ? @footer_links : self.find(1).footer_links
  end

  def self.title
    @title = @title.present? ? @title : self.find(1).title
  end

  def self.desc
    @desc = @desc.present? ? @desc : self.find(1).desc
  end

  def self.logo
    @logo = @logo.present? ? @logo : self.find(1).logo
  end

  def self.contact_us_blurb
    @contact_us_blurb = @contact_us_blurb.present? ? @contact_us_blurb : self.find(1).contact_us_blurb
  end
end
