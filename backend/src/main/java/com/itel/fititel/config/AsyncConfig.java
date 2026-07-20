package com.itel.fititel.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Enables @Async support, required by the flipbook PDF-to-WebP processing
 * pipeline (see concept/08-implementation-guides/flipbook-microservice-guide.md).
 */
@Configuration
@EnableAsync
public class AsyncConfig {
}
