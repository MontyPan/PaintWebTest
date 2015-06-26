<%@page import="java.net.URLDecoder"%>
<%@page import="java.io.File"%>
<%@page import="java.awt.image.BufferedImage"%>
<%@page import="javax.imageio.ImageIO"%>
<%@page import="java.io.ByteArrayInputStream"%>
<%@page import="javax.xml.bind.DatatypeConverter"%>
<%@page import="java.io.InputStream"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
StringBuilder sb = new StringBuilder();
InputStream is = request.getInputStream();
int c;

while( (c = is.read()) != -1) {
	sb.append((char)c);
}

String base64 = URLDecoder.decode(sb.toString(), "UTF-8").substring("data:image/jpeg;base64,".length());

byte[] imageByte = DatatypeConverter.parseBase64Binary(base64);

ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
BufferedImage image = ImageIO.read(bis);
System.out.println(image);//Delete

ImageIO.write(image, "JPG", new File("d:/test/ImageEditor.jpg"));
%>