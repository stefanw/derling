d3.derling = function() {

    var getHeight = function(a) {
        return Math.sqrt(3) / 2 * a
    };

    var equilateralTriangle = function(a, flipped){
        var h = getHeight(a);
        rot = rotation;
        if (flipped) {
          if (rotation % 2) {
            rot = rot - 1;
          } else {
            rot = rot + 1;
          }
        }
        if (rot === 0) {
          // /\
          return 'M 0 ' + h + ' L ' + (a / 2) +' 0 L ' + a + ' ' + h + ' z';
        } else if (rot === 1) {
          // \/
          return 'M 0 0 L' + (a / 2) + ' ' + h + ' L ' + a + ' 0 z';
        } else if (rot === 2) {
          // >
          return 'M 0 0 L ' + h + ' ' + (a / 2) + ' L 0 ' + a + ' z';
        } else if (rot === 3) {
          // <
          return 'M ' + h + ' 0 L' + h + ' ' + a + ' L 0 ' + (a / 2) + ' z';
        }
    };

    var getSideFromArea = function(A) {
        return Math.sqrt(A / Math.sqrt(3) * 4);
    };

    var isFlipped = function(d) {
      return !((d.x + d.y) % 2);
    };

    var rotation = 0;
    var paddingX = 3;
    var paddingY = 3;
    var showLabel = false;
    var sideWidth = 10;
    var shapeFill;
    var textFill;
    var offsets = {};
    var scale;


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
                    if (scale !== undefined) {
                      a = getSideFromArea(scale(d.value) * 100);
                    }
                    var h = getHeight(a), x, y;
                    if (rotation < 2) {
                      x = d.x * ((a / 2) + paddingX);
                      y = d.y * (h + paddingY);
                    } else {
                      x = d.x * (h + paddingX);
                      y = d.y * ((a / 2) + paddingY);
                    }
                    if (scale !== undefined) {
                      var min = scale.range()[0];
                      var offset = offsets[d.x + '@' + d.y];
                      if (offset !== undefined) {
                        x += offset[0];
                        y += offset[1];
                      }
                      offsets[(d.x + 1) + '@' + d.y] = [offset[0] + (a - min), offset[1] + (a - min)];
                    }
                    var t = 'translate(' + x + ', ' + y + ')';
                    return t;

                });

            g.append('path')
                .attr('d', function(d) {
                    var a = sideWidth;
                    if (scale !== undefined) {
                      a = getSideFromArea(scale(d.value) * 100);
                    }
                    return equilateralTriangle(a, isFlipped(d));
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
                        var h = getHeight(a), x, y;
                        if (rotation < 2) {
                          x = a / 2;
                          y = (isFlipped(d) + (rotation % 2)) % 2 ? h / 2.5 : h / 1.2;
                        } else {
                          y = a / 1.8
                          x = (isFlipped(d) + (rotation % 2)) % 2 ? h / 1.9 : h / 2.5;
                        }
                        return 'translate( ' + x + ', ' + y + ')';
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
    my.rotation = function(value) {
        if (!arguments.length) return rotation;
        rotation = value;
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
    my.scale = function(value) {
        if (!arguments.length) return scale;
        scale = value;
        return my;
    };
    my.textFill = function(value) {
        if (!arguments.length) return textFill;
        textFill = value;
        return my;
    };

    return my;
};
