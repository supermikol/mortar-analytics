class CreateRevenues < ActiveRecord::Migration
  def change
    create_table :revenues do |t|
      t.date :date
      t.string :invoice_number
      t.string :vendor
      t.string :kindof, default: "Revenue"
      t.string :category
      t.integer :quantity
      t.text :description
      t.float :total
      t.string :country
      t.string :doc_img, default: ""

      t.timestamps null: false
    end
  end
end
