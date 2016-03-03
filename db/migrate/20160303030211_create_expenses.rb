class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.date :date
      t.string :invoice_number
      t.string :kindof, default: "Expenditure"
      t.string :vendor
      t.string :category
      t.text :description
      t.float :total
      t.string :country, default: "N/A"
      t.string :doc_img, default: ""

      t.timestamps null: false
    end
  end
end
