import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.*;


public class Http {

    public static String get(String URL, Map<String, String> params) throws Exception {
        StringBuilder sb = new StringBuilder(URL);
        sb.append("?");
        for (Map.Entry<String, String> entry : params.entrySet()) {
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(entry.getValue());
            sb.append("&");
        }
        URL myURL = new URL(sb.toString());
        URLConnection yc = myURL.openConnection();
        BufferedReader in = new BufferedReader(new InputStreamReader(
                yc.getInputStream()));
        String inputLine;
        sb = new StringBuilder();
        while ((inputLine = in.readLine()) != null)
            sb.append(inputLine);
        in.close();
        return sb.toString();
    }

}
