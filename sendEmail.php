<?php

$enroll = $_POST["enroll"];
$firstName = $_POST["firstName"];
$surname = $_POST["surname"];
$dateOfbirth = $_POST["dateOfbirth"];
$birthRegNo = $_POST["birthRegNo"];
$gender = $_POST["gender"];
$religion = $_POST["religion"];
$rank = $_POST["rank"];
$health = $_POST["health"];
$diet = $_POST["diet"];
$guardian = $_POST["guardian"];
$guardianPhone = $_POST["guardianPhone"];
$kin = $_POST["kin"];
$kinPhone = $_POST["kinPhone"];
$guardianAddress = $_POST["guardianAddress"];
$kinAddress = $_POST["kinAddress"];
$religion = $_POST["religion"];
$rank = $_POST["rank"];
$health = $_POST["health"];
$diet = $_POST["diet"];

require "vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->SMTPAuth = true;  

$mail-> Host = 'smtp.gmail.com';
$mail-> SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;

$mail->Username = 'chamisaphil@gmail.com';
$mail->Password ='!@#$pHil.';

$mail->setForm($email, $name);
$email->addAddress("chamisaphil@gmail.com", "Phil");

$email->Subject =$subject;
$mail->Body = $message;

$email->send();

header('Location: sent.html');