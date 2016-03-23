class AddAttachmentInvoiceJpgToExpenses < ActiveRecord::Migration
  def self.up
    change_table :expenses do |t|
      t.attachment :invoice_jpg
    end
  end

  def self.down
    remove_attachment :expenses, :invoice_jpg
  end
end
