require 'date'

Revenue.delete_all
Expense.delete_all

#Seed Revenue
client_list = ["客户1", "客户2", "客户3", "客户4", "客户5", "客户6"]
categories = ["产品 A", "产品 B", "产品 C", "产品 D"]
descriptions = ["珧屇舑枹蠷煇蛖忏屾洷氚,呡咈旰貆乇虮蜾腶。", "焱芧旮賮滁壆彴一棎珺蚋沭屳复乇，巰棨兀舠俓隑弢阞丌泍劄垟丏帙。", "脟一姩堄椈椯乇綝瞡夃，弶屮陏桾絒瑐乜瘔旡犮。", "殕泑忏殫稢髷穵一菵珺悜肵庂茇乜，暊詙乇抴峔靸祊庀丌泲踄洟殳岥。", "丮郤侐勖胏醾喍滜犵阢洉卣孥彽旵嵣兀佌駃嵲。", "丮唒枟荳迡鑫裛舝汊仱姷芐泔帙抌蜋屮抳嗹稐。", "尐娗玠梲迣麡硻腞阤邘茌伿妴囷邡筲丌呿銙溰。", "仂烅怬殌柋鑨痵絺奷圴狤氚竻岟忺廆兀狋嫙絽。軨洰机壉絿瞡朳一絏崮窆炓尒竑兀，詺媓丌耵恮嗖盰尕亍肵嶆姷圠邲。"

]
countries = ["美国", "西班牙", "土耳其", "内地", "英国", "澳洲", "韩国", "日本"]
sample_invoices = ["sample_invoice.jpg","sample_invoice2.gif","sample_invoice3.gif","sample_invoice4.png"]
counter = -29
30.times do
  7.times do
    Revenue.create( date: Date.today + counter, invoice_number: rand(999), client: client_list[rand(6)], category: categories[rand(4)], description: descriptions[rand(8)], total: rand(50000), country: countries[rand(7)], quantity: (rand(20)+1)*100, doc_img: sample_invoices[rand(4)] )
  end
  counter += 1
end

#Seed Expenses
vendor_list = ["提供者1", "提供者2", "提供者3", "提供者4", "提供者5"]
expense_category = ["办公用品", "工资" "租金", "管理费用"]

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
