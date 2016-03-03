class PagesController < ApplicationController
  def index
  end

  def history
    @records = Revenue.all + Expense.all
    @revenues = Revenue.all
    @expenses = Expense.all
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


end
