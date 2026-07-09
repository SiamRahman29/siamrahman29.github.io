---
title: "Building RICO: Rather Intelligent Conversational Operator"
summary: "My first shot at building a JARVIS: a voice-controlled assistant in Python."
date: 2025-08-13
draft: false
tags: ["tutorial", "python", "project"]
ogImage: "/writing/building-rico.jpg"
---

RICO stands for Rather Intelligent Conversational Operator. Just before ChatGPT started trending, I built RICO. RICO's purpose was to be a voice-controlled intelligent operator. He would be able to do simple operations like sending emails, telling me about the weather, firing up some applications, and updating me on current news.

![RICO](/writing/building-rico.jpg)

I had a lot of fun building him and it was not that complicated as you can see in the GitHub repo at the bottom. Here is how you can build your own version of RICO.

## Setup

Before diving into the code, you'll need to set up your development environment and gather the necessary API keys.

### Prerequisites

RICO is built with Python and requires several key dependencies:

- **pyttsx3**: For text-to-speech functionality
- **SpeechRecognition**: For voice input processing
- **requests**: For making HTTP API calls
- **wikipedia**: For Wikipedia searches
- **pywhatkit**: For WhatsApp messaging and YouTube integration
- **python-decouple**: For secure environment variable management

### Environment Configuration

Create a `.env` file in your project root following the env.example file.

**API Keys Required:**
- **News API**: Get your free key from [newsapi.org](https://newsapi.org)
- **OpenWeatherMap**: Sign up at [openweathermap.org](https://openweathermap.org)
- **TMDB (The Movie Database)**: Register at [themoviedb.org](https://themoviedb.org)
- **Gmail**: Use an App Password for Gmail SMTP authentication

### Installation

```bash
pip install -r requirements.txt
```

## Input

RICO's voice input system is built using the `SpeechRecognition` library with Google's speech recognition service. For the input handling we'll write a function that takes audio input and returns the user's query:

```python
import speech_recognition as sr

def take_user_input():
    r = sr.Recognizer() 
    with sr.Microphone() as source:
        print('Listening...')
        r.pause_threshold = 1 # Pause 1 second after listening
        audio = r.listen(source, phrase_time_limit = 2) # 2 seconds per phrase
    
    try:
        print('Recognizing...')
        query = r.recognize_google(audio, language='en-us')
        if not "exit" in query or "stop" or "that will be all" in query:
            speak(choice(opening_text))
        else:
            speak(choice(closing_text))
            exit()
    except Exception:
        speak(choice(confused_text))
        query = "None"
    return query
```

## Output

RICO's text-to-speech system uses `pyttsx3` with the Windows SAPI5 engine. You can try out different voices to see which one you prefer when you are setting up the "voice" property of the engine.

```python
import pyttsx3

engine = pyttsx3.init('sapi5')

engine.setProperty('rate', 180)

engine.setProperty('volume',1.0)

voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id) # Change voices here

def speak(text):
    engine.say(text)
    engine.runAndWait()
```

**Voice Configuration:**
- **Rate**: 180 words per minute
- **Volume**: Maximum (1.0)
- **Voice**: Default system voice
- **Engine**: Windows SAPI5

The system also includes a personalized greeting system that adapts based on the time of day:

```python
def greet_user():
    hour = datetime.now().hour
    if hour >= 6 and hour < 12:
        speak(f"Good Morning{USERNAME}")
    elif hour >= 12 and hour < 16:
        speak(f"Good afternoon{USERNAME}")
    elif hour >= 16 and hour < 19:
        speak(f"Good Evening{USERNAME}")
    speak(f"Rico here. What's good? How may I help you boss?")
```

## Functions

RICO's functionality is divided into two main categories: online and offline functions.

### Online Functions

Located in `Online_Functions.py`, these functions require internet connectivity and API access:

#### Weather Information
```python
def get_weather_report(city):
    res = requests.get(
        f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_APP_ID}&units=metric").json()
    weather = res["weather"][0]["main"]
    temperature = res["main"]["temp"]
    feels_like = res["main"]["feels_like"]
    return weather, f"{temperature}℃", f"{feels_like}℃"
```

#### News Headlines
```python
def get_latest_news():
    news_headlines = []
    res = requests.get(
        f"https://newsapi.org/v2/top-headlines?country=in&apiKey={NEWS_API_KEY}&category=general").json()
    articles = res["articles"]
    for article in articles:
        news_headlines.append(article["title"])
    return news_headlines[:5]
```

#### Email Sending
```python
def send_email(receiver_address, subject, message):
    try:
        email = EmailMessage()
        email['To'] = receiver_address
        email['Subject'] = subject
        email['From'] = EMAIL
        email.set_content(message)
        s = smtplib.SMTP("smtp.gmail.com", 587)
        s.starttls()
        s.login(EMAIL, PASSWORD)
        s.send_message(email)
        s.close()
        return True
    except Exception as e:
        print(e)
        return False
```

#### WhatsApp Messaging
```python
def send_whatsapp_message(number, message):
    kit.sendwhatmsg_instantly(f"+88{number}", message)
```

#### Web Search and Entertainment
- **Google Search**: `search_on_google(query)`
- **YouTube Playback**: `play_on_youtube(video)`
- **Wikipedia Search**: `search_on_wikipedia(query)`
- **Random Jokes**: `get_random_joke()`
- **Random Advice**: `get_random_advice()`
- **Trending Movies**: `get_trending_movies()`
- **IP Address Lookup**: `find_my_ip()`

### Offline Functions

Located in `Offline_Functions.py`, these functions work without internet connectivity:

#### Application Launchers
```python
paths = {
    'vscode': "C:\\Users\\USER\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe",
    'discord': "C:\\Users\\USER\\AppData\\Local\\Discord\\app-1.0.9003\\Discord.exe",
    'notepad': "C:\\Program Files\\Windows NT\\Accessories\\wordpad.exe",
    'calc': "C:\\Windows\\System32\\calc.exe"
}

def open_camera():
    sp.run('start microsoft.windows.camera', shell = True)

def open_notepad():
    os.startfile(paths['notepad'])

def open_discord():
    os.startfile(paths['discord'])

def open_calc():
    sp.Popen(paths['calc'])

def open_vscode():
    os.startfile(paths['vscode'])

def open_cmd():
    os.system('start cmd')
```

**Available Offline Functions:**
- **Camera**: Opens Windows Camera app
- **Calculator**: Launches system calculator
- **Notepad**: Opens text editor
- **Discord**: Launches Discord application
- **VS Code**: Opens code editor
- **Command Prompt**: Opens terminal

## Main Control Loop

The heart of RICO is the main control loop in `main.py` that processes voice commands:

```python
while True:
    query = take_user_input().lower()
    if "that will be all" in query:
        speak(choice(closing_text))
        break

    # Command processing with if-elif chains
    if 'open notepad' in query:
        open_notepad()
    elif 'open discord' in query:
        open_discord()
    # ... more commands
```

**Key Features:**
- **Continuous listening**: Runs until user says "that will be all"
- **Natural language processing**: Simple keyword matching
- **Error handling**: Graceful fallbacks for failed operations
- **Dual output**: Both voice and console feedback

## Personality and User Experience

RICO has a distinct personality crafted with different kinds of contextual responses. You can edit these in your utils file to create your own personality.

**Opening Responses:**
- "Just a moment"
- "Understood"
- "In a minute"
- "Hydrate while I'm on it"
- "I wonder if I'll be able to do it properly"
- "Gimme a minute"

**Closing Responses:**
- "Understood"
- "Okay then"
- "Let me know if I can interest you in a sarcastic comment"
- "Okay"

**Error Responses:**
- "Come again?"
- "Pardon me, louder please sir"
- "Umm come again for Rico"

## Conclusion

RICO is a testament to how simple yet effective voice-controlled assistants can be built with basic Python libraries. The modular architecture makes it easy to extend with new functions, and the personality-driven responses create an engaging user experience.

**Key Strengths:**
- **Simple Architecture**: Easy to understand and modify
- **Modular Design**: Separate files for different functionalities
- **Error Handling**: Graceful degradation when things go wrong
- **Personality**: Engaging conversational responses
- **Extensibility**: Easy to add new commands and functions

**Areas for Improvement:**
- **Natural Language Understanding**: Could benefit from more sophisticated NLP
- **Command Recognition**: More robust pattern matching
- **Configuration**: Better path management for different systems
- **Security**: Enhanced credential management

RICO is the foundation for my current project RICA where I am implementing a team of AI agents. Gonna write about that soon!

*GitHub repo: [github.com/SiamRahman29/Rico](https://github.com/SiamRahman29/Rico)*
