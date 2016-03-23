class AddAttachmentInvoiceJpgToRevenues < ActiveRecord::Migration
  def self.up
    change_table :revenues do |t|
      t.attachment :invoice_jpg
    end
  end

  def self.down
    remove_attachment :revenues, :invoice_jpg
  end
end
