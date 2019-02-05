var bar_marker_chart = function(widgetBody, data) {
    let datalenght = Object.keys(data[0]).length;
    var margin = {
        top: 20,
        right: 90,
        bottom: 70,
        left: 40
    },
    width = 600 - margin.left - margin.right ,
    height = 300 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var yright = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

    var yAxisright = d3.svg.axis()
    .scale(yright)
    .orient("right")
    .ticks(10);

    var tip = d3.tip()
    .attr('class', 'myd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>salary:</strong> <span style='color:red'>" + d.salary + "</span>";
    })

    var tipattr = d3.tip()
    .attr('class', 'myd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
        console.log(this)
        return "<strong>" + this.getAttribute('data-metric') + ":</strong><span style='color:" + this.getAttribute('fill') + "'>" + d[this.getAttribute('data-metric')] + "</span>"
    })

    //add rect
    let legendrectbox = [];
    for (let i = 2; i <= Object.keys(data[0]).length; i++) {
        legendrectbox.push(Object.keys(data[0])[i - 1])
    }
    //

    let rectbox = [];
    let heightbox = [];
    for (let i = 3; i <= Object.keys(data[0]).length; i++) {
        rectbox.push(Object.keys(data[0])[i - 1])
        heightbox.push(i)
    }
    clr = ["orange", "blue", "red", "pink", "black"]

    legendclr = ["steelblue","orange", "blue", "red", "pink", "black"]

    // add the SVG element

    var svg = d3.select(widgetBody).append("svg")
    .attr("viewBox","0 0 1000 1200")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var linearV = d3.scale.ordinal()
    .domain(legendrectbox)
    .range(legendclr);
    svg.append("g")
    .attr("class", "legendV")
    .attr("transform", "translate(700,10)");
    
    var legendV = d3.legend.color()
    .shapeWidth(20)
    .cells(10)
    .title("Linear")
    .labelFormat(d3.format('.0f'))
    .scale(linearV);
    svg.select(".legendV")
    .call(legendV);

    svg.call(tip);
    svg.call(tipattr);
    if (datalenght > 2) {
        console.log(data)
        // scale the range of the data
        x.domain(data.map(function(d) {
      
            return d.name;
        }))
        y.domain([0, d3.max(data, function(d) {
            return d.salary;
        })])
        yright.domain([0, d3.max(data, function(d) {
            return d.attendence;
        })])

        // add axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "translate(25,10)")

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("main");

        svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .attr("class", "y axis")
        .call(yAxisright)
        .append("text")
        .attr("transform", "translate(80,50)")
        .attr('y', -15)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("values");

        // Add bar chart
        svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.name);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.salary);
        })
        .attr("height", function(d) {
            return height - y(d.salary);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

        for (let i = 0; i <= rectbox.length - 1; i++) {
            svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d) {
                return x(d.name);
            })
            .attr("width", x.rangeBand())
            .attr("data-metric", function(d) {
                return rectbox[i];
            })
                .attr("y", function(d) {
                    return y(d[rectbox[i]]);
                })
                .attr("height", function(d) {
                    v = {}
                    for (var k in d) {
                        v[k] = d[k]
                    }
                    delete(v[Object.keys(v)[1]])
                    delete(v[Object.keys(v)[0]])
                    valu = d3.keys(v).length - d3.keys(v).indexOf(rectbox[i])
                    delete(v[rectbox[i]])
                    hovr = rectbox[i]
                    return (d3.values(v).indexOf(d[rectbox[i]]) >= 0) ? (valu * 2) : 3
                })
                .attr('fill', function(d) {
                    return clr[i]
                })
                .on('mouseover', tipattr.show)
                .on('mouseout', tipattr.hide);
            }
        } else {
            x.domain(data.map(function(d) {
                return d.name;
            }))

            svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "translate(25,10)")
        }
    }