import com.google.gson.Gson;
import spark.ResponseTransformer;

public class JsonUtil implements ResponseTransformer {

    private Gson gson = new Gson();

    public String render(Object model) {
        return gson.toJson(model);
    }

}