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

  def add_entry

  end


end
