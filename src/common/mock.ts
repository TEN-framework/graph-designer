import { IExtension, IConnection } from "@/types"

export const MOCK_EXTENTIONS: IExtension[] = [
  {
    "addon": "agora_rtc",
    "name": "agora_rtc",
    "extension_group": "default",
    "app": "localhost",
    "api": {
      "property": {
        "publish_video_width": {
          "type": "int32"
        },
        "subscribe_audio_sample_rate": {
          "type": "int32"
        },
        "subscribe_audio": {
          "type": "bool"
        },
        "agora_asr_vendor_name": {
          "type": "string"
        },
        "encryption_salt": {
          "type": "string"
        },
        "enable_agora_asr": {
          "type": "bool"
        },
        "publish_data": {
          "type": "bool"
        },
        "publish_video_frame_rate": {
          "type": "int32"
        },
        "agora_asr_session_control_file_path": {
          "type": "string"
        },
        "encryption_mode": {
          "type": "int32"
        },
        "subscribe_video": {
          "type": "bool"
        },
        "token": {
          "type": "string"
        },
        "publish_video": {
          "type": "bool"
        },
        "subscribe_audio_num_of_channels": {
          "type": "int32"
        },
        "stream_id": {
          "type": "Uint32"
        },
        "subscribe_video_pix_fmt": {
          "type": "int32"
        },
        "remote_stream_id": {
          "type": "Uint32"
        },
        "channel": {
          "type": "string"
        },
        "sdk_log_file_path": {
          "type": "string"
        },
        "agora_asr_vendor_region": {
          "type": "string"
        },
        "app_id": {
          "type": "string"
        },
        "area_code": {
          "type": "int32"
        },
        "agora_asr_language": {
          "type": "string"
        },
        "publish_audio": {
          "type": "bool"
        },
        "encryption_key": {
          "type": "string"
        },
        "agora_asr_vendor_key": {
          "type": "string"
        },
        "publish_video_height": {
          "type": "int32"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "on_user_joined",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "user_id",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "remote_user_id",
              "attributes": {
                "type": "string"
              }
            }
          ]
        },
        {
          "name": "on_user_left",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "user_id",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "remote_user_id",
              "attributes": {
                "type": "string"
              }
            }
          ]
        },
        {
          "name": "on_connection_failure",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "user_id",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "data_in": [
        {
          "name": "data"
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "time",
              "attributes": {
                "type": "int64"
              }
            },
            {
              "name": "duration_ms",
              "attributes": {
                "type": "int64"
              }
            },
            {
              "name": "language",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "audio_frame_in": [
        {
          "name": "audio_frame"
        }
      ],
      "audio_frame_out": [
        {
          "name": "audio_frame",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            }
          ]
        }
      ],
      "video_frame_in": [
        {
          "name": "video_frame"
        }
      ],
      "video_frame_out": [
        {
          "name": "video_frame",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            }
          ]
        }
      ]
    },
    "property": {
      "agora_asr_language": "en-US",
      "agora_asr_session_control_file_path": "session_control.conf",
      "agora_asr_vendor_key": "<azure_stt_key>",
      "agora_asr_vendor_name": "microsoft",
      "agora_asr_vendor_region": "<azure_stt_region>",
      "app_id": "<agora_appid>",
      "channel": "astra_agents_test",
      "enable_agora_asr": true,
      "publish_audio": true,
      "publish_data": true,
      "remote_stream_id": 123,
      "stream_id": 1234,
      "subscribe_audio": true,
      "token": "<agora_token>"
    }
  },
  {
    "addon": "interrupt_detector",
    "name": "interrupt_detector",
    "extension_group": "default",
    "app": "localhost",
    "api": {
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ]
    },
    "property": null
  },
  {
    "addon": "openai_chatgpt",
    "name": "openai_chatgpt",
    "extension_group": "chatgpt",
    "app": "localhost",
    "api": {
      "property": {
        "greeting": {
          "type": "string"
        },
        "prompt": {
          "type": "string"
        },
        "max_tokens": {
          "type": "int64"
        },
        "api_key": {
          "type": "string"
        },
        "model": {
          "type": "string"
        },
        "frequency_penalty": {
          "type": "float64"
        },
        "presence_penalty": {
          "type": "float64"
        },
        "max_memory_length": {
          "type": "int64"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ]
    },
    "property": {
      "api_key": "<openai_api_key>",
      "base_url": "",
      "frequency_penalty": 0.9,
      "greeting": "ASTRA agent connected. How can i help you today?",
      "max_memory_length": 10,
      "max_tokens": 512,
      "model": "gpt-3.5-turbo",
      "prompt": "",
      "proxy_url": ""
    }
  },
  {
    "addon": "azure_tts",
    "name": "azure_tts",
    "extension_group": "tts",
    "app": "localhost",
    "api": {
      "property": {
        "azure_subscription_region": {
          "type": "string"
        },
        "azure_subscription_key": {
          "type": "string"
        },
        "azure_synthesis_voice_name": {
          "type": "string"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "audio_frame_out": [
        {
          "name": "audio_frame"
        }
      ]
    },
    "property": {
      "azure_subscription_key": "<azure_tts_key>",
      "azure_subscription_region": "<azure_tts_region>",
      "azure_synthesis_voice_name": "en-US-JaneNeural"
    }
  },
  {
    "addon": "chat_transcriber",
    "name": "chat_transcriber",
    "extension_group": "transcriber",
    "app": "localhost",
    "api": {
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "data"
        }
      ]
    },
    "property": null
  }
]


export const MOCK_CONNECTIONS: IConnection[] = [
  {
    "app": "localhost",
    "extension_group": "default",
    "extension": "agora_rtc",
    "data": [
      {
        "name": "text_data",
        "dest": [
          {
            "app": "localhost",
            "extension_group": "default",
            "extension": "interrupt_detector"
          }
        ]
      },
      {
        "name": "text_data",
        "dest": [
          {
            "app": "localhost",
            "extension_group": "chatgpt",
            "extension": "openai_chatgpt"
          }
        ]
      },
      {
        "name": "text_data",
        "dest": [
          {
            "app": "localhost",
            "extension_group": "transcriber",
            "extension": "chat_transcriber"
          }
        ]
      }
    ]
  },
  {
    "app": "localhost",
    "extension_group": "chatgpt",
    "extension": "openai_chatgpt",
    "cmd": [
      {
        "name": "flush",
        "dest": [
          {
            "app": "localhost",
            "extension_group": "tts",
            "extension": "azure_tts"
          }
        ]
      }
    ]
  },
  {
    "app": "localhost",
    "extension_group": "tts",
    "extension": "azure_tts",
    "cmd": [
      {
        "name": "flush",
        "dest": [
          {
            "app": "localhost",
            "extension_group": "default",
            "extension": "agora_rtc"
          }
        ]
      }
    ]
  },
  {
    "app": "localhost",
    "extension_group": "transcriber",
    "extension": "chat_transcriber",
    "data": [
      {
        "name": "data",
        "dest": [
          {
            "app": "localhost",
            "extension_group": "default",
            "extension": "agora_rtc"
          }
        ]
      }
    ]
  },
  {
    "app": "localhost",
    "extension_group": "default",
    "extension": "interrupt_detector",
    "cmd": [
      {
        "name": "flush",
        "dest": [
          {
            "app": "localhost",
            "extension_group": "chatgpt",
            "extension": "openai_chatgpt"
          }
        ]
      }
    ]
  }
]



export const MOCK_INSTALLED_EXTENTIONS: IExtension[] = [
  {
    "name": "agora_rtc",
    "api": {
      "property": {
        "publish_audio": {
          "type": "bool"
        },
        "area_code": {
          "type": "int32"
        },
        "encryption_key": {
          "type": "string"
        },
        "app_id": {
          "type": "string"
        },
        "enable_agora_asr": {
          "type": "bool"
        },
        "token": {
          "type": "string"
        },
        "channel": {
          "type": "string"
        },
        "subscribe_audio_sample_rate": {
          "type": "int32"
        },
        "agora_asr_session_control_file_path": {
          "type": "string"
        },
        "publish_data": {
          "type": "bool"
        },
        "agora_asr_vendor_name": {
          "type": "string"
        },
        "agora_asr_vendor_key": {
          "type": "string"
        },
        "publish_video_frame_rate": {
          "type": "int32"
        },
        "subscribe_audio_num_of_channels": {
          "type": "int32"
        },
        "encryption_mode": {
          "type": "int32"
        },
        "agora_asr_language": {
          "type": "string"
        },
        "subscribe_video": {
          "type": "bool"
        },
        "publish_video_height": {
          "type": "int32"
        },
        "stream_id": {
          "type": "Uint32"
        },
        "sdk_log_file_path": {
          "type": "string"
        },
        "subscribe_video_pix_fmt": {
          "type": "int32"
        },
        "encryption_salt": {
          "type": "string"
        },
        "publish_video": {
          "type": "bool"
        },
        "publish_video_width": {
          "type": "int32"
        },
        "agora_asr_vendor_region": {
          "type": "string"
        },
        "remote_stream_id": {
          "type": "Uint32"
        },
        "subscribe_audio": {
          "type": "bool"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "on_user_joined",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "user_id",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "remote_user_id",
              "attributes": {
                "type": "string"
              }
            }
          ]
        },
        {
          "name": "on_user_left",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "user_id",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "remote_user_id",
              "attributes": {
                "type": "string"
              }
            }
          ]
        },
        {
          "name": "on_connection_failure",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "user_id",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "data_in": [
        {
          "name": "data"
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "time",
              "attributes": {
                "type": "int64"
              }
            },
            {
              "name": "duration_ms",
              "attributes": {
                "type": "int64"
              }
            },
            {
              "name": "language",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "audio_frame_in": [
        {
          "name": "audio_frame"
        }
      ],
      "audio_frame_out": [
        {
          "name": "audio_frame",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            }
          ]
        }
      ],
      "video_frame_in": [
        {
          "name": "video_frame"
        }
      ],
      "video_frame_out": [
        {
          "name": "video_frame",
          "property": [
            {
              "name": "channel",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            }
          ]
        }
      ]
    },
    "addon": "agora_rtc",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "openai_chatgpt",
    "api": {
      "property": {
        "max_tokens": {
          "type": "int64"
        },
        "greeting": {
          "type": "string"
        },
        "frequency_penalty": {
          "type": "float64"
        },
        "max_memory_length": {
          "type": "int64"
        },
        "prompt": {
          "type": "string"
        },
        "api_key": {
          "type": "string"
        },
        "model": {
          "type": "string"
        },
        "presence_penalty": {
          "type": "float64"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ]
    },
    "addon": "openai_chatgpt",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "elevenlabs_tts_python",
    "api": {
      "property": {
        "speaker_boost": {
          "type": "bool"
        },
        "model_id": {
          "type": "string"
        },
        "api_key": {
          "type": "string"
        },
        "optimize_streaming_latency": {
          "type": "int64"
        },
        "voice_id": {
          "type": "string"
        },
        "similarity_boost": {
          "type": "float64"
        },
        "stability": {
          "type": "float64"
        },
        "request_timeout_seconds": {
          "type": "int64"
        },
        "style": {
          "type": "float64"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "audio_frame_out": [
        {
          "name": "audio_frame"
        }
      ]
    },
    "addon": "elevenlabs_tts_python",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "elevenlabs_tts",
    "api": {
      "property": {
        "model_id": {
          "type": "string"
        },
        "request_timeout_seconds": {
          "type": "int64"
        },
        "api_key": {
          "type": "string"
        },
        "optimize_streaming_latency": {
          "type": "int64"
        },
        "speaker_boost": {
          "type": "bool"
        },
        "similarity_boost": {
          "type": "float64"
        },
        "style": {
          "type": "float64"
        },
        "stability": {
          "type": "float64"
        },
        "voice_id": {
          "type": "string"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "audio_frame_out": [
        {
          "name": "audio_frame"
        }
      ]
    },
    "addon": "elevenlabs_tts",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "qwen_llm_python",
    "api": {
      "property": {
        "max_tokens": {
          "type": "int64"
        },
        "greeting": {
          "type": "string"
        },
        "prompt": {
          "type": "string"
        },
        "api_key": {
          "type": "string"
        },
        "max_memory_length": {
          "type": "int64"
        },
        "model": {
          "type": "string"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ]
    },
    "addon": "qwen_llm_python",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "chat_transcriber",
    "api": {
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "data"
        }
      ]
    },
    "addon": "chat_transcriber",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "interrupt_detector_python",
    "api": {
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ]
    },
    "addon": "interrupt_detector_python",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "openai_chatgpt_python",
    "api": {
      "property": {
        "greeting": {
          "type": "string"
        },
        "max_memory_length": {
          "type": "int64"
        },
        "presence_penalty": {
          "type": "float64"
        },
        "frequency_penalty": {
          "type": "float64"
        },
        "base_url": {
          "type": "string"
        },
        "proxy_url": {
          "type": "string"
        },
        "api_key": {
          "type": "string"
        },
        "temperature": {
          "type": "float64"
        },
        "model": {
          "type": "string"
        },
        "max_tokens": {
          "type": "int64"
        },
        "top_p": {
          "type": "float64"
        },
        "prompt": {
          "type": "string"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ]
    },
    "addon": "openai_chatgpt_python",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "chat_transcriber_python",
    "api": {
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            },
            {
              "name": "stream_id",
              "attributes": {
                "type": "Uint32"
              }
            },
            {
              "name": "end_of_segment",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "data"
        }
      ]
    },
    "addon": "chat_transcriber_python",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "azure_tts",
    "api": {
      "property": {
        "azure_subscription_key": {
          "type": "string"
        },
        "azure_subscription_region": {
          "type": "string"
        },
        "azure_synthesis_voice_name": {
          "type": "string"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "audio_frame_out": [
        {
          "name": "audio_frame"
        }
      ]
    },
    "addon": "azure_tts",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "cosy_tts",
    "api": {
      "property": {
        "voice": {
          "type": "string"
        },
        "api_key": {
          "type": "string"
        },
        "model": {
          "type": "string"
        },
        "sample_rate": {
          "type": "int64"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "audio_frame_out": [
        {
          "name": "audio_frame"
        }
      ]
    },
    "addon": "cosy_tts",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "bedrock_llm_python",
    "api": {
      "property": {
        "prompt": {
          "type": "string"
        },
        "max_tokens": {
          "type": "int64"
        },
        "max_memory_length": {
          "type": "int64"
        },
        "model": {
          "type": "string"
        },
        "secret_key": {
          "type": "string"
        },
        "access_key": {
          "type": "string"
        },
        "greeting": {
          "type": "string"
        }
      },
      "cmd_in": [
        {
          "name": "flush"
        }
      ],
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ],
      "data_out": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            }
          ]
        }
      ]
    },
    "addon": "bedrock_llm_python",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  },
  {
    "name": "interrupt_detector",
    "api": {
      "cmd_out": [
        {
          "name": "flush"
        }
      ],
      "data_in": [
        {
          "name": "text_data",
          "property": [
            {
              "name": "text",
              "attributes": {
                "type": "string"
              }
            },
            {
              "name": "is_final",
              "attributes": {
                "type": "bool"
              }
            }
          ]
        }
      ]
    },
    "addon": "interrupt_detector",
    "app": "localhost",
    "extension_group": "default",
    "property": null
  }
]
