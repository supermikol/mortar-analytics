class PagesController < ApplicationController
  def index
    if request.xhr?
      render 'index', layout: false
    else
      render 'index'
    end
  end


  def history
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
      else
        render partial: 'table', layout: false, locals: {records: @records}
      end
    end

  end

  # Sums up revenues and expenses by date
  def stacked_chart
    revenues = Revenue.select("date", "SUM(total)").group("date")
    expenses = Expense.select("date", "SUM(total)").group("date")
    @data = [revenues, expenses]
    render json: @data
  end


end
