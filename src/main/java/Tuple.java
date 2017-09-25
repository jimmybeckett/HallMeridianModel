public class Tuple {

    public final int sunrise;
    public final int sunset;

    public Tuple(int sunrise, int sunset) {
        this.sunrise = sunrise;
        this.sunset = sunset;
    }

    public String toString() {
        return sunrise + " , " + sunset;
    }
}
