package com.ferreteria.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Envía un correo electrónico HTML de forma asíncrona.
     * 
     * @param to           Destinatario
     * @param subject      Asunto
     * @param templateName Nombre del archivo HTML en resources/templates
     * @param variables    Variables para reemplazar en la plantilla (ej:
     *                     nombreCliente, total)
     * @param pdfBytes     (Opcional) Array de bytes del PDF a adjuntar
     * @param pdfName      (Opcional) Nombre del archivo PDF
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables,
            byte[] pdfBytes, String pdfName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true = multipart (para adjuntos)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            // Procesar plantilla HTML con Thymeleaf
            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process(templateName, context);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = es HTML

            // Adjuntar PDF si existe
            if (pdfBytes != null && pdfName != null) {
                helper.addAttachment(pdfName, new ByteArrayResource(pdfBytes));
            }

            mailSender.send(message);
            System.out.println("📧 Correo enviado exitosamente a: " + to);

        } catch (MessagingException e) {
            System.err.println("❌ Error al enviar correo a " + to + ": " + e.getMessage());
            // En producción, aquí deberías registrar el error en un log o tabla de fallos
        }
    }
}
