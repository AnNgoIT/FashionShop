package fit.tlcn.fashionshopbe.security;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.owasp.encoder.Encode;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class CustomHttpServletRequestWrapper extends HttpServletRequestWrapper {
    private static final Pattern XSS_PATTERN = Pattern.compile("\\<.*\\>");

    public CustomHttpServletRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
    }

    private String filterXSS(String value){
        return Encode.forHtml(value);
    }

    @Override
    public String getParameter(String name) {
        String value = super.getParameter(name);
        if(value == null){
            return null;
        }
        value = filterXSS(value.trim());
        return value;
    }

    @Override
    public String[] getParameterValues(String name) {
        String[] values = super.getParameterValues(name);
        if (values == null)
            return null;

        for(int i = 0; i<values.length; i++){
            values[i] = filterXSS(values[i].trim());
        }
        return values;
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        Map<String, String[]> originalMap = super.getParameterMap();
        if (originalMap == null)
            return null;
        return originalMap.entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> Arrays.stream(entry.getValue())
                                .map(Encode::forHtml)
                                .toArray(String[]::new)
                ));
    }
    @Override
    public ServletInputStream getInputStream() throws IOException {
        ServletInputStream stream = super.getInputStream();
        if (stream == null) {
            return null;
        }
        BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8));
        StringBuilder stringBuilder = new StringBuilder();

        String line;
        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line.replace("<", "&lt;").replace(">", "&gt;"));
        }

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(stringBuilder.toString().getBytes(StandardCharsets.UTF_8));
        return new CachedServletInputStream(byteArrayInputStream);
    }

    public class CachedServletInputStream extends ServletInputStream {

        private final ByteArrayInputStream inputStream;

        public CachedServletInputStream(ByteArrayInputStream inputStream) {
            this.inputStream = inputStream;
        }

        @Override
        public boolean isFinished() {
            return inputStream.available() == 0;
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public void setReadListener(ReadListener readListener) {
            throw new UnsupportedOperationException();
        }

        @Override
        public int read() throws IOException {
            return inputStream.read();
        }

        @Override
        public int read(byte[] b) throws IOException {
            return inputStream.read(b);
        }

        @Override
        public int read(byte[] b, int off, int len) throws IOException {
            return inputStream.read(b, off, len);
        }
    }
}
