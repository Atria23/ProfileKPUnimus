@component('mail::message')
# Lamaran Pekerjaan Baru Telah Diterima

Berikut adalah detail lamaran untuk posisi **{{ $vacancy->profession }}**.

---

**Nama Pelamar:** {{ $applicantName }}

**Email Pelamar:** {{ $applicantEmail }}

---

Berkas yang dilampirkan terdapat pada attachment email ini.

Terima kasih,<br>
Sistem {{ config('app.name') }}
@endcomponent