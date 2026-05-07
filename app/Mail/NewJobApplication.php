<?php

namespace App\Mail;

use App\Models\JobVacancy;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewJobApplication extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public JobVacancy $vacancy,
        public string $applicantName,
        public string $applicantEmail,
        public array $attachmentsData
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: $this->applicantEmail,
            subject: 'Lamaran Baru untuk Posisi: ' . $this->vacancy->profession,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.applications.new', // Buat view ini
        );
    }

    public function attachments(): array
    {
        $attachments = [];
        foreach ($this->attachmentsData as $file) {
            $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromPath($file->getRealPath())
                ->as($file->getClientOriginalName())
                ->withMime($file->getClientMimeType());
        }
        return $attachments;
    }
}