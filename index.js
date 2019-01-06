/* THIS IS A PENDING PROJECT FOR JSCHOES NOT SURE HE STILL WANTS IT BUT I WILL DO IT 
    SHOULD IN CASE HE CAME BACK ASKING OF IT */

/** ADOPT THE CONCEPT OF REUSABLE STRICTLY */
function drawExpensesChart(){

    // Declaration of variables
    let width = 600, height = 400;
    let margin = {top: 20, bottom: 20, left: 50, right: 20};
    let svgWidth = width - margin.left - margin.top;
    let svgHeight = height - margin.right - margin.bottom;

    // Updatables
    var expenses;

    function drawChart(selection){
        selection.each(function(){
            // begin implementation here

        })

    }// end drawChart

    // Setter-Getter for the expenses
    drawChart.expenses = function(value){
                            if(!arguments.length){
                                return expenses;
                            }
                            expenses = value;
                            return drawChart;
                        }

    // return the chart
    return drawChart;
}//end drawExpensesChart
