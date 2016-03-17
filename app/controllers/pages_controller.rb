class PagesController < ApplicationController
  def index
    @history_tab = false
    if request.xhr?
      render 'index', layout: false
    else
      render 'index'
    end
  end


  def history
    @history_tab = true
    unless params[:begin_date].nil? || params[:end_date].nil?
      @revenues = Revenue.where(date: (params[:begin_date]..params[:end_date]))
      @expenses = Expense.where(date: (params[:begin_date]..params[:end_date]))
    else
      @revenues = Revenue.all
      @expenses = Expense.all
    end
    @records = @revenues + @expenses

    if request.xhr?
      if params[:type] == "#revenue"
        render partial: 'table', layout: false, locals: {records: @revenues}
      elsif params[:type] == "#expense"
        render partial: 'table', layout: false, locals: {records: @expenses}
      elsif params[:type] == "#all"
        render partial: 'table', layout: false, locals: {records: @records}
      elsif params[:type] == "datepicker"
        render partial: 'table', layout: false, locals: {records: @records}
      else
        render 'history', layout: false
      end
    end


  end

  def form
    render partial: 'form', layout: false
  end

  def create_entry

    @revenue = Revenue.new( revenue_params )
    @revenue.doc_img = "sample_invoice4.png"
    @revenue.save

    redirect_to history_index_path
  end

  # Sums up revenues and expenses up to current date
  def sum
    p Date.today
    p Date.today - params[:timeframe].to_i
    revenues = Revenue.select("date", "SUM(total)").where("date > ?", Date.today - params[:timeframe].to_i).group("date").order("date")
    expenses = Expense.select("date", "SUM(total)").where("date > ?", Date.today - params[:timeframe].to_i).group("date").order("date")
    @data = [revenues, expenses]
    render json: @data
  end

  private
  def revenue_params

    params.require(:revenue).permit(:invoice_jpg, :entryDate, :invoiceNumber, :vendor, :category, :description, :total, :country, :quantity)

    # date: params[:entryDate], invoice_number: params[:invoiceNumber], client: params[:vendor], category: params[:category], description: params[:description], total: params[:total], country: params[:country], quantity: params[:quantity], doc_img: "sample_invoice4.png")
  end


end
