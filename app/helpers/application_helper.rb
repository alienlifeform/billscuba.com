module ApplicationHelper

  # super_simple_format 
  #
  # based on Ruby simple_format:
  # http://api.rubyonrails.org/classes/ActionView/Helpers/TextHelper.html#method-i-simple_format)
  #
  # Changes: 
  # Default is to NOT sanitize
  # Default is to NOT transform single line breaks to <br />
  # Returns +text+ transformed into HTML using simple formatting rules.
  # Two or more consecutive newlines(<tt>\n\n</tt>) are considered as a
  # paragraph and wrapped in <tt><p></tt> tags. One newline (<tt>\n</tt>) is
  # considered as a linebreak and a <tt><br /></tt> tag is appended. This
  # method does not remove the newlines from the +text+.
  #
  # You can pass any HTML attributes into <tt>html_options</tt>. These
  # will be added to all created paragraphs.
  #
  # ==== Options
  # * <tt>:sanitize</tt> - If +false+, does not sanitize +text+.
  #
  # ==== Examples
  #   my_text = "Here is some basic text...\n...with a line break."
  #
  #   super_simple_format(my_text)
  #   # => "<p>Here is some basic text...\n<br />...with a line break.</p>"
  #
  #   more_text = "We want to put a paragraph...\n\n...right there."
  #
  #   super_simple_format(more_text)
  #   # => "<p>We want to put a paragraph...</p>\n\n<p>...right there.</p>"
  #
  #   super_simple_format("Look ma! A class!", :class => 'description')
  #   # => "<p class='description'>Look ma! A class!</p>"
  #
  #   super_simple_format("<span>I'm allowed!</span> It's true.", {}, :sanitize => false)
  #   # => "<p><span>I'm allowed!</span> It's true.</p>"
  def super_simple_format(text, html_options={}, options={})
    text = '' if text.nil?
    if text.index('<html>') == 0
      # This is an html doc (starts with <html>), don't format, remove tags
      logger.debug('TEXT1: ' + text.gsub('/<html>|<\/html>/',''))
      text = text.gsub('/<html>|<\/html>/','')
    else
      logger.debug('super_simple_formatting...')
      text = text.dup
      start_tag = tag('p', html_options, true)
      text = sanitize(text) if options[:sanitize] == true
      text = text.to_str
      text.gsub!(/\r\n?/, "\n") # \r\n and \r -> \n
      text.gsub!(/\n\n+/, "</p>\n\n#{start_tag}") unless options[:p] == false  # 2+ newline  -> paragraph
      text.gsub!(/([^\n]\n)(?=[^\n])/, '\1<br />') unless options[:br] == false # 1 newline   -> br
      text.insert 0, start_tag
      text.html_safe.safe_concat("</p>")
    end
  end
end
