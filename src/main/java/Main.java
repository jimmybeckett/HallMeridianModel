import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import spark.Spark;

import java.util.*;

import static spark.Spark.*;

public class Main {

    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger(Main.class);
        Spark.staticFileLocation("/webapp");

        get("/getSSTimes", (req, res) -> {
            logger.info("get request to /getSSTimes");
            try {
                Calendar calendar = Calendar.getInstance();
                calendar.setTimeInMillis(Long.parseLong(req.headers("millis")));
                Tuple[] table = new Tuple[3];
                calendar.add(Calendar.DAY_OF_MONTH, -1);
                table[1] = new SunsetSunriseTable(calendar.get(Calendar.YEAR), req.headers("state"), req.headers("city")).getTable()[calendar.get(Calendar.MONTH)][calendar.get(Calendar.DAY_OF_MONTH)];
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                table[2] = new SunsetSunriseTable(calendar.get(Calendar.YEAR), req.headers("state"), req.headers("city")).getTable()[calendar.get(Calendar.MONTH)][calendar.get(Calendar.DAY_OF_MONTH)];
                calendar.add(Calendar.DAY_OF_MONTH, -2);
                table[0] = new SunsetSunriseTable(calendar.get(Calendar.YEAR), req.headers("state"), req.headers("city")).getTable()[calendar.get(Calendar.MONTH)][calendar.get(Calendar.DAY_OF_MONTH)];
                return table;
            } catch (Exception e) {
                logger.error(Arrays.toString(e.getStackTrace()));
                return 500;
            }
        }, new JsonUtil());
    }
}
