require 'date'

Revenue.delete_all
Expense.delete_all

#Seed Revenue
client_list = ["Client 1", "Client 2", "Client 3", "Client 4", "Client 5", "Client 6"]
categories = ["Produce", "Canned Goods", "Frozen Food", "Hygiene Products"]
descriptions = ["The supermarket typically comprises meat, fresh produce, dairy, and baked goods aisles, along with shelf space reserved for canned and packaged goods as well as for various non-food items such as kitchenware, household cleaners, pharmacy products and pet supplies.", "Some supermarkets also sell a variety of other household products that are consumed regularly, such as condoms (where permitted), medicine, and clothes, and some stores sell a much wider range of non-food products: DVDs, sporting equipment, board games, and seasonal items (e.g., Christmas wrapping paper in December).", "The traditional supermarket occupies a large amount of floor space, usually on a single level. It is usually situated near a residential area in order to be convenient to consumers. The basic appeal is the availability of a broad selection of goods under a single roof, at relatively low prices.", "Other advantages include ease of parking and frequently the convenience of shopping hours that extend into the evening or even 24 hours of day.", "Supermarkets usually allocate large budgets to advertising, typically through newspapers.","They also present elaborate in-shop displays of products. The shops are usually part of corporate chains that own or control (sometimes by franchise) other supermarkets located nearby—even transnationally—thus increasing opportunities for economies of scale.", "Supermarkets typically are supplied by the distribution centres of their parent companies, usually in the largest city in the area. Supermarkets usually offer products at relatively low prices by using their buying power to buy goods from manufacturers at lower prices than smaller stores can.", "They also minimise financing costs by paying for goods at least 30 days after receipt and some extract credit terms of 90 days or more from vendors.", "Certain products (typically staple foods such as bread, milk and sugar) are very occasionally sold as loss leaders, that is, with negative profit margins so as to attract shoppers to their store."]
countries = ["USA", "Spain", "Turkey", "Canada", "England", "Europe", "Korea", "Japan"]
sample_invoices = ["sample_invoice.jpg","sample_invoice2.gif","sample_invoice3.gif","sample_invoice4.png"]
counter = -29
30.times do
  7.times do
    Revenue.create( date: Date.today + counter, invoice_number: rand(999), vendor: client_list[rand(6)], category: categories[rand(4)], description: descriptions[rand(8)], total: rand(50000), country: countries[rand(7)], quantity: (rand(20)+1)*100, doc_img: sample_invoices[rand(4)] )
  end
  counter += 1
end

#Seed Expenses
vendor_list = ["Supplier 1", "Supplier 2", "Supplier 3", "Supplier 4", "Supplier 5"]
expense_category = ["Office Supplies", "Labor Cost", "Rental", "Management Fee"]

counter = -29
30.times do
  5.times do
    Expense.create( date: Date.today + counter, invoice_number: rand(999), vendor: vendor_list[rand(7)], category: expense_category[rand(3)], description: descriptions[rand(8)], total: rand(30000), doc_img: sample_invoices[rand(4)])
  end
  counter += 1
end

counter = -4
2.times do
  2.times do
    Expense.create( date: Date.today + counter, invoice_number: rand(999), vendor: vendor_list[rand(7)], category: expense_category[rand(3)], description: descriptions[rand(8)], total: rand(140000), doc_img: sample_invoices[rand(4)])
  end
  counter += 1
end
