import { Injectable, Logger } from "@nestjs/common";
import { CreateContactDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  async sendContactMessage(createContactDto: CreateContactDto) {
    try {
      const DISCORD_WEBHOOK_URL =
        process.env.DISCORD_WEBHOOK_URL ||
        "https://discord.com/api/webhooks/1361728535047176393/XO14QcOY7DvaQPy2Z8UP3Wrytoy3baKwOS8hg01wA_9A6NENcvNh0MLiLmvLtTgsJfPM";

      const discordMessage = {
        embeds: [
          {
            title: "📬 New Contact Message",
            color: 0x0099ff,
            fields: [
              { name: "👤 Name", value: createContactDto.name, inline: true },
              { name: "📧 Email", value: createContactDto.email, inline: true },
              { name: "📱 Phone", value: createContactDto.phone, inline: true },
              { name: "📝 Subject", value: createContactDto.subject || "N/A" },
              { name: "💬 Message", value: createContactDto.message },
            ],
            footer: { text: "Sent from Shimla Manali Tour Website" },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      this.logger.log("Sending contact message to Discord");

      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordMessage),
      });

      this.logger.log(`Discord webhook response status: ${response.status}`);

      if (response.status === 204 || response.ok) {
        this.logger.log("Contact message sent successfully to Discord");
        return { success: true, message: "Message sent successfully" };
      } else {
        const errorText = await response.text();
        this.logger.error(
          `Discord webhook failed: ${response.status} ${response.statusText} - ${errorText}`
        );
        throw new Error(
          `Failed to send message to Discord: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      this.logger.error("Error sending contact message:", error);
      throw error;
    }
  }
}
