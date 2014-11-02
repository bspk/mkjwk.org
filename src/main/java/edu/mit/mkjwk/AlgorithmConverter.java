package edu.mit.mkjwk;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.Algorithm;

@Component
public class AlgorithmConverter implements Converter<String, Algorithm> {

	@Override
	public Algorithm convert(String s) {
		Algorithm a = new Algorithm(s);
		return a;
	}

}
