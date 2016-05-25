d3.derling = function() {

    var getHeight = function(a) {
        return Math.sqrt(3) / 2 * a
    };

    var equilateralTriangle = function(a){
        var h = getHeight(a);
        return 'M 0 ' + h + ' L ' + (a / 2) +' '+ 0 + ' L ' + a + ' ' + h + ' z';
    };
    var equilateralTriangleFlipped = function(a){
        var h = getHeight(a);
        return 'M 0  0 L' + (a / 2) + ' ' + h + ' L ' + a +' 0 z';
    };

    var getSideFromArea = function(A) {
        return Math.sqrt(A / Math.sqrt(3) * 4);
    };

    var isFlipped = function(d) {
        return (d.x + d.y) % 2 == !flipped;
    };

    var flipped = true;
    var paddingX = 3;
    var paddingY = 3;
    var showLabel = true;
    var sideWidth = 10;
    var shapeFill;
    var textFill;


    // h = √3 / 2 * a
    // p = 3 * a
    // A = a² * √3 / 4
    // a = \(A / \3 * 4)

    function my(selection) {
        selection.each(function(d, i) {
            // inside here, d is the current data item, i is its index.
            // "this" is the element that has been appended, in the case of
            // this example, a svg:g

            var element = d3.select(this);

            var g = element.append('g')
                .attr('transform', function(d){
                    var a = sideWidth;
                    var h = getHeight(a);
                    var t = 'translate(' + d.x * ((a / 2) + paddingX) + ', ' + d.y * (h + paddingY) + ')';
                    return t;

                });

            g.append('path')
                .attr('d', function(d) { 
                    var a = sideWidth;
                    if (isFlipped(d)) {
                        return equilateralTriangleFlipped(a);
                    }
                    return equilateralTriangle(a);
                })
                .style('fill', function(d){
                    if (typeof shapeFill === "function") {
                        return shapeFill(d);
                    }
                    return shapeFill;
                })

            if (showLabel) {
                g.append('text')
                    .attr('transform', function(d){
                        var a = sideWidth;
                        var h = getHeight(a);
                        var y = isFlipped(d) ? h / 2.5 : h / 1.2; 
                        return 'translate( ' + a / 2 + ', ' + y + ')';
                    })
                    .attr('text-anchor', 'middle')
                    .text(function(d){ return d.label; })
                    .style('fill', function(d){
                        if (typeof textFill === "function") {
                            return textFill(d);
                        }
                        return textFill;
                    })
            }

        });

    }

    // getter / setter for the label property
    my.flipped = function(value) {
        if (!arguments.length) return flipped;
        flipped = value;
        return my;
    };
    my.sideWidth = function(value) {
        if (!arguments.length) return sideWidth;
        sideWidth = value;
        return my;
    };
    my.showLabel = function(value) {
        if (!arguments.length) return showLabel;
        showLabel = value;
        return my;
    };
    my.fill = function(value) {
        if (!arguments.length) return shapeFill;
        shapeFill = value;
        return my;
    };
    my.textFill = function(value) {
        if (!arguments.length) return textFill;
        textFill = value;
        return my;
    };

    return my;
}
