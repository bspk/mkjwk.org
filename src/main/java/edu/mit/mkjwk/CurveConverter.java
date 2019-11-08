package edu.mit.mkjwk;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import com.google.common.base.Strings;
import com.nimbusds.jose.jwk.Curve;

@Component
public class CurveConverter implements Converter<String, Curve> {

	@Override
	public Curve convert(String s) {
		
		if (Strings.isNullOrEmpty(s)) {
			return null;
		}
		
		Curve c = Curve.parse(s);
		
		return c;
	}

	
	
}
