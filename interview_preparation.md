# Interview Preparation Guide: Junior IT Security Analyst

This guide contains the most likely technical and project-related questions you will face during your interview at Fourth Command, along with tailored, professional answers based on your background.

---

## 1. Questions About Your "Mini SOC Lab" Project

### Q1: Can you walk me through the architecture of your Mini SOC Lab?
*   **Answer:** "Certainly. The lab is built in an isolated VirtualBox environment using a Host-Only network configuration to safely contain malicious telemetry. The architecture consists of four virtual machines:
    1.  **SIEM Server:** Running Ubuntu Server with the Wazuh Manager, Indexer, and Dashboard (OpenSearch-based) to aggregate and visualize logs.
    2.  **Windows Endpoint:** Running Windows 11 Enterprise with a Wazuh Agent and Sysmon (configured using SwiftOnSecurity baselines) to capture system-level logs like process creation and network connections.
    3.  **Linux Endpoint:** Running Ubuntu Desktop with a Wazuh Agent and Auditd configured to monitor command executions and system changes.
    4.  **Attacker Machine:** Running Kali Linux used to emulate threats using tools like Hydra, Nmap, and Metasploit.
    In addition, I built a custom dashboard using Next.js and FastAPI to visualize alerts outside of the standard Kibana/Wazuh interface."

### Q2: How did you configure telemetry collection on the endpoints?
*   **Answer:** "For the Windows endpoint, I installed the Wazuh agent and deployed Sysmon (System Monitor) to log deep events like Event ID 1 (Process Creation) and Event ID 3 (Network Connections). On the Linux endpoint, I configured `Auditd` to track command line events and user actions. Both endpoints ship these logs to the Wazuh Manager via their respective Wazuh agent services, where the manager's rules engine decodes and matches the incoming logs against custom and default XML rules."

### Q3: Describe a custom detection rule you engineered. How did it work?
*   **Answer:** "I created several custom rules in `local_rules.xml` on the Wazuh Manager. For example, to detect a **PowerShell Download Cradle (T1059.001)**, I wrote a rule that searches for Event ID 1 (Process Creation) originating from Sysmon. The rule used regex patterns to inspect the process command line arguments for keywords like `Net.WebClient`, `DownloadFile`, `DownloadString`, or `Invoke-WebRequest` executed via PowerShell. When a matching pattern was detected, it triggered a Level 10 alert on the dashboard."

### Q4: Tell me about one of the simulated attacks you performed and how you triaged it.
*   **Answer:** "I simulated an **SSH Brute Force Attack (T1110)** from the Kali machine to the Linux endpoint using Hydra. 
    1.  **Detection:** The attack generated hundreds of authentication failures in `/var/log/auth.log`, which triggered a high-level Wazuh alert (Rule ID: 5712 for multiple failed logins).
    2.  **Triage:** I analyzed the log metadata in the Wazuh dashboard. I identified the attacker's source IP address and confirmed that the target username was being cycled rapidly.
    3.  **Containment & Remediation:** I documented the Indicators of Compromise (IoCs) and simulated containment by implementing a host-based firewall rule (`iptables`) to block the source IP, and recommended enforcing SSH key-based authentication."

---

## 2. General SOC Operations & Incident Response

### Q5: What is the difference between a True Positive and a False Positive?
*   **Answer:** 
    *   "A **True Positive** is an alert that correctly identifies malicious or unauthorized activity. For example, a Wazuh alert firing on a successful SSH brute force login from an external IP.
    *   **A False Positive** is an alert that fires on benign, legitimate activity. For example, a custom rule firing a security alert because a system administrator is running a legitimate network scan using Nmap during a scheduled maintenance window.
    *   As an analyst, part of my role is to tune rules to minimize false positives so the team doesn't suffer from alert fatigue."

### Q6: Can you explain the Incident Response Lifecycle?
*   **Answer:** "I follow the NIST Incident Response Framework, which has four main phases:
    1.  **Preparation:** Hardening systems, setting up logging (like Sysmon/Auditd), and writing detection rules before an incident occurs.
    2.  **Detection & Analysis:** Monitoring alerts, triaging indicators of compromise (IoCs), and validating whether an event is a True Positive.
    3.  **Containment, Eradication, & Recovery:** Isolating affected systems, removing the threat (e.g., stopping malicious processes, deleting web shells), and restoring systems to normal operations.
    4.  **Post-Incident Activity:** Documenting lessons learned to improve detection rules and prevent future incidents."

### Q7: If you detect a compromised endpoint on the network, what is your immediate first step?
*   **Answer:** "The immediate first step is **Containment** to prevent the threat from spreading (lateral movement) or exfiltrating data. I would isolate the compromised host from the network. In a real environment, this can be done via EDR agent isolation or modifying network switch ports. After containment, I would begin the analysis phase to collect memory dumps, logs, and establish the scope of the compromise."

---

## 3. Networking & Operating System Security

### Q8: What happens during a TCP 3-way handshake?
*   **Answer:** "The TCP 3-way handshake establishes a reliable connection between a client and server:
    1.  **SYN:** The client sends a SYN (Synchronize) packet to the server to initiate the connection.
    2.  **SYN-ACK:** The server responds with a SYN-ACK packet, indicating it received the request and is willing to connect.
    3.  **ACK:** The client sends an ACK (Acknowledge) packet back to the server, and the connection is established."

### Q9: How does DNS work, and how can threat actors abuse it?
*   **Answer:** "DNS (Domain Name System) translates human-readable domain names (like `google.com`) into IP addresses. Threat actors abuse it in several ways:
    *   **DNS Tunneling:** Encoding malicious payloads or exfiltrating data inside DNS queries (since DNS traffic is rarely blocked by firewalls).
    *   **Domain Generation Algorithms (DGA):** Malware generates random domain names dynamically to establish connections with Command and Control (C2) servers.
    *   **DNS Spoofing/Poisoning:** Altering DNS records to redirect users to malicious phishing sites."

---

## 4. Scripting & Database (Transferable Skills)

### Q10: How can Python be useful to a SOC Analyst?
*   **Answer:** "Python is invaluable for automation and security integrations. I can use it to:
    *   Parse and extract indicators (IPs, hashes) from raw text logs.
    *   Query APIs (such as VirusTotal) to automatically enrich alerts with threat intelligence.
    *   Automate repetitive tasks like checking endpoint patch levels or checking firewall rule statuses.
    In my internship at SSM Technologies and in my SOC project, I used Python to manage backend data pipelines and automate API integrations."

### Q11: How do you protect a database against SQL Injection (SQLi)?
*   **Answer:** "The most effective way to prevent SQL Injection is by using **Parameterized Queries** (also known as Prepared Statements) rather than concatenating user input directly into SQL strings. Additionally, implementing input validation, sanitization, and executing queries with database users that have least-privilege permissions significantly reduces the risk. In my project and internship, I utilized Pydantic for data validation and ORMs to ensure SQL safety."

---

## 5. Self-Introduction & Behavioral Questions

### Q12: Tell me about yourself.
*   **Answer:** "I am a B.Tech Computer Science and Engineering student graduating in 2026, with a strong focus and passion for defensive security operations and threat detection. Recently, I completed a Python Development internship at SSM Technologies, where I gained experience managing database architectures and building robust data applications. To apply these skills in security, I built a complete Mini SOC Lab from scratch. In this project, I configured Wazuh SIEM, deployed Windows and Linux endpoint logging, simulated common attack vectors, and performed alert triage and incident response. I am deeply interested in working on the front lines of defense as an analyst, which is what brings me here today."

### Q13: Why do you want to join Fourth Command for this role?
*   **Answer:** "I want to join Fourth Command because I am looking for a structured, hands-on environment where I can contribute to real-world security operations. Your Junior IT Security Analyst description aligns perfectly with my background—combining log monitoring, endpoint security, and Python automation. I appreciate that Fourth Command values technical curiosity and discipline, and I am excited about the opportunity to relocate to Jaipur to collaborate in person with a dedicated security team."

### Q14: Describe a time you faced a difficult technical challenge and how you overcame it.
*   **Answer:** "While setting up the database connection for my security dashboard in the Mini SOC Lab, my backend service kept failing to start during the lifespan initialization, resulting in a connection error. When looking at the trace logs, I discovered that the database URI was parsing incorrectly, failing at DNS address resolution (`getaddrinfo failed`). The root cause was that my database password generated by the cloud provider contained a special character, the `@` symbol, which confused the connection string parser. I researched how database connection URIs parse credentials and learned that special characters must be percent-encoded. I replaced the `@` symbol with `%40` in my `.env` configuration file, which resolved the connection parse issue and allowed the service to initialize successfully."

### Q15: How do you handle stressful situations or alert fatigue?
*   **Answer:** "I handle stress by relying on structured processes and prioritization. In a SOC environment, alert fatigue is a real challenge. I address this by focusing on:
    1.  **Triage & Severity:** Prioritizing critical alerts first (e.g., active command shell execution over a minor port scan).
    2.  **Standard Operating Procedures (SOPs):** Following defined incident handling playbooks step-by-step to stay objective.
    3.  **Rule Tuning:** Documenting false positives so they can be filtered out or the underlying rules can be tuned to reduce noise. 
    Staying organized and documenting my findings systematically helps me remain calm under pressure."

### Q16: Where do you see yourself in 3 to 5 years?
*   **Answer:** "In the next 3 to 5 years, my goal is to progress from a Junior Analyst to a Senior SOC Analyst or an Incident Response specialist. I want to build deep expertise in detection engineering, threat hunting, and digital forensics. Ultimately, I want to become a core technical resource who can lead complex incident investigations and help design stronger defensive architectures for the organization."

