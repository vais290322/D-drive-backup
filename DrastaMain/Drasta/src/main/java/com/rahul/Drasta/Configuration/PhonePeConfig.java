package com.rahul.Drasta.Configuration;

import com.phonepe.sdk.pg.Env;
import com.phonepe.sdk.pg.payments.v2.StandardCheckoutClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class PhonePeConfig {
    @Bean
    public StandardCheckoutClient phonepeClient(
            @Value("${phonepe.clientId}") String clientId,
            @Value("${phonepe.clientSecret}") String clientSecret,
            @Value("${phonepe.clientVersion}") Integer clientVersion,
            @Value("${phonepe.env}") String envString) {

        Env env = Env.valueOf(envString.toUpperCase());  // SANDBOX or PRODUCTION
        return StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
    }


}
