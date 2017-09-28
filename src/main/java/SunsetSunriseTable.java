import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class SunsetSunriseTable {
    private Tuple[][] table;
    private Logger logger = LoggerFactory.getLogger(SunsetSunriseTable.class);

    public SunsetSunriseTable(int year, String state, String city) {
        int[] times = new int[0];
        try {
            times = getTable(year, state, city);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        table = new Tuple[12][31];
        table[1] = year % 4 != 0 && year % 100 != 0 && year % 400 != 0 ? new Tuple[28] : new Tuple[29];
        table[3] = new Tuple[30];
        table[5] = new Tuple[30];
        table[8] = new Tuple[30];
        table[10] = new Tuple[30];
        int timeIndex;
        for (int month = 0; month < 12; month++) {
            timeIndex = month * 2;
            for (int day = 0; day < table[month].length; day++) {
                table[month][day] = (new Tuple(times[timeIndex], times[timeIndex + 1]));
                timeIndex += 23;
                switch (day) {
                    case 27: {
                        timeIndex += year % 4 != 0 && year % 100 != 0 && year % 400 != 0 ? 0 : -2;
                        timeIndex += month == 0 ? 2 : 0;
                        break;
                    }
                    case 28: timeIndex -= 2; break;
                    case 29: {
                        switch (month) {
                            case 11:
                                timeIndex -= 2;
                            case 9:
                                timeIndex -= 2;
                            case 7:
                            case 6:
                                timeIndex -= 2;
                            case 4:
                                timeIndex -= 2;
                            case 2:
                                timeIndex -= 2;
                            case 1:
                            case 0: timeIndex -= month == 0 ? 2 : 0;
                        }
                    }
                }
            }
        }
    }

    public Tuple[][] getTable() {
        return table;
    }

    private static int[] getTable(int year, String state, String city) throws Exception {
        String url = "http://aa.usno.navy.mil/cgi-bin/aa_rstablew.pl";
        Map<String, String> params = new HashMap<>();
        params.put("ID", "AA");
        params.put("year", "" + year);
        params.put("task", "0");
        params.put("state", state);
        params.put("place", city);
        String table = Http.get(url, params);
        int[] times = new int[732];
        int timeCount = 0;
        Scanner scan = new Scanner(table);
        while (!scan.next().equals("Observatory")) ;
        String s;
        while (scan.hasNext()) {
            s = scan.next();
            if (isNumeric(s) && s.length() == 4) {
                times[timeCount] = Integer.parseInt(s);
                timeCount++;
            }
        }
        return times;
    }


    private static boolean isNumeric(String str) {
        return str.chars().allMatch(Character::isDigit);
    }
}


