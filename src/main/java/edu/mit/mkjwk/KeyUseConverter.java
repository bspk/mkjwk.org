package edu.mit.mkjwk;

import java.text.ParseException;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.jwk.KeyUse;

@Component
public class KeyUseConverter implements Converter<String, KeyUse> {

	@Override
	public KeyUse convert(String s) {
		try {
			KeyUse k = KeyUse.parse(s);
			return k;
		} catch (ParseException e) {
			return null;
		}
		
	}

}
