/**
 * This class overrides {@link Ellipse} to define a 2D circle and provides
 * several utility methods for it, including factory methods to construct
 * circles from points.
 */
 
function Circle(a,b,c) {
	if(b === undefined)
	{
		if(a instanceof Circle)
		{
			this.parent.init.call(this,a,a.radius.x);
		}
		else
		{
			this.parent.init.call(this,0,0,a);
		}
	}
	else
	{
		if(c === undefined)
		{
			this.parent.init.call(this,a,b);
		}
		else
		{
			this.parent.init.call(this,a,b,c,c);
		}
	
	}

}


Circle.prototype = new Ellipse();
Circle.constructor = Circle;
Circle.prototype.parent = Ellipse.prototype;

Circle.prototype.containsPoint = function(p) {
    return this.distanceToSquared(p) <= this.radius.x * this.radius.x;
}

Circle.prototype.getCircumference = function() {
    return MathUtils.TWO_PI * this.radius.x;
}

Circle.prototype.getRadius = function() {
    return this.radius.x;
}

Circle.prototype.getTangentPoints = function(p) {
    var m = this.interpolateTo(p, 0.5);
    return this.intersectsCircle(new Circle(m, m.distanceTo(p)));
}

Circle.prototype.intersectsCircle = fucntion(c) {
    var res = null;
    var delta = c.sub(this);
    var d = delta.magnitude();
    var r1 = this.radius.x;
    var r2 = c.radius.x;
    if (d <= r1 + r2 && d >= Math.abs(r1 - r2)) {
        var a = (r1 * r1 - r2 * r2 + d * d) / (2.0 * d);
        d = 1 / d;
        var p = this.add(delta.scale(a * d));
        var h = Math.sqrt(r1 * r1 - a * a);
        delta.perpendicular().scaleSelf(h * d);
        var i1 = p.add(delta);
        var i2 = p.sub(delta);
        res = [i1, i2 ];
    }
    return res;
}

Circle.prototype.setRadius = function(r) {
    this.setRadii(r, r);
    return this;
}


/**
 * Factory method to construct a circle which has the two given points lying
 * on its perimeter. If the points are coincident, the circle will have a
 * radius of zero.
 * 
 * @param p1
 * @param p2
 * @return new circle instance
 */
Circle.from2Points = function(p1,p2) {
    var m = p1.interpolateTo(p2, 0.5);
    return new Circle(m, m.distanceTo(p1));
}

/**
 * Factory method to construct a circle which has the three given points
 * lying on its perimeter. The function returns null, if the 3 points are
 * co-linear (in which case it's impossible to find a circle).
 * 
 * Based on CPP code by Paul Bourke:
 * http://local.wasp.uwa.edu.au/~pbourke/geometry/circlefrom3/
 * 
 * @param p1
 * @param p2
 * @param p3
 * @return new circle instance or null
 */
Circle.from3Points = function(p1,p2,p3) {
    var circle = null,
    deltaA = p2.sub(p1),
    deltaB = p3.sub(p2);
    if (MathUtils.abs(deltaA.x) <= 0.0000001 && MathUtils.abs(deltaB.y) <= 0.0000001) {
        var centroid = new Vec2D(p2.x + p3.x, p1.y + p2.y).scaleSelf(0.5);
        var radius = centroid.distanceTo(p1);
        circle = new Circle(centroid, radius);
    } else {
        var aSlope = deltaA.y / deltaA.x;
        var bSlope = deltaB.y / deltaB.x;
        if (MathUtils.abs(aSlope - bSlope) > 0.0000001) {
            var x = (aSlope * bSlope * (p1.y - p3.y) + bSlope * (p1.x + p2.x) - aSlope * (p2.x + p3.x)) / (2 * (bSlope - aSlope));
            var y = -(x - (p1.x + p2.x) / 2) / aSlope + (p1.y + p2.y) / 2;
            var centroid = new Vec2D(x, y);
            var radius = centroid.distanceTo(p1);
            circle = new Circle(centroid, radius);
        }
    }
    return circle;
}


