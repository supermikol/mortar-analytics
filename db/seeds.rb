# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'date'

#Seed Revenue
client_list = ["BCBG", "Jimmy Choo", "Max Mara", "Payless", "Walmart", "LV"]
categories = ["Men", "Women", "Children", "Toddler"]
descriptions = ["Let me help you with your baggage.", "If you like tuna and tomato sauce- try combining the two. It’s really not as bad as it sounds.", "Sometimes, all you need to do is completely make an ass of yourself and laugh it off to realise that life isn’t so bad after all.", "She did not cheat on the test, for it was not the right thing to do.", "She only paints with bold colors; she does not like pastels.", "I want more detailed information.", "He said he was not there yesterday; however, many people saw him there.", "How was the math test?", "The river stole the gods.", "I would have gotten the promotion, but my attendance wasn’t good enough.", "I love eating toasted cheese and tuna sandwiches.", "He told us a very exciting adventure story."]
countries = ["Lebanon", "Mauritius", "Panama", "Turkey", "Colombia", "Kuwait", "Austria"]
sample_invoices = ["sample_invoice.jpg","sample_invoice2.gif","sample_invoice3.gif","sample_invoice4.png"]
counter = -5
6.times do
  7.times do
    Revenue.create( date: Date.today + counter, invoice_number: rand(999), client: client_list[rand(6)], category: categories[rand(4)], description: descriptions[rand(12)], total: rand(5000), country: countries[rand(7)], quantity: (rand(20)+1)*100, doc_img: sample_invoices[rand(4)] )
  end
  counter += 1
end

#Seed Expenses
vendor_list = ["Panasonic", "Apple", "Sony", "Noahs", "JCPenny", "Kleenex", "Genentech"]
expense_category = ["Office Supplies", "Material Cost", "Overhead"]

counter = -5
6.times do
  5.times do
    Expense.create( date: Date.today + counter, invoice_number: rand(999), vendor: vendor_list[rand(7)], category: expense_category[rand(3)], description: descriptions[rand(5)], total: rand(3000), doc_img: sample_invoices[rand(4)])
  end
  counter += 1
end