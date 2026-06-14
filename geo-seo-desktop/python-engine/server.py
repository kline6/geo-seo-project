#!/usr/bin/env python3
"""GEO Audit Engine - stdio JSON server"""
import sys
import json
import traceback

# Ensure stdout uses UTF-8
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

from audit.scorer import score_content


def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
            title = request.get("title", "")
            content_md = request.get("content_md", "")
            language = request.get("language", "zh-CN")
            platforms = request.get("platforms", ["chatgpt"])
            options = request.get("options", {})

            result = score_content(title, content_md, language, platforms, options)
            response = {"success": True, "data": result}
        except Exception as e:
            response = {
                "success": False,
                "error": {
                    "code": "AUDIT_ERROR",
                    "message": str(e),
                    "details": traceback.format_exc(),
                },
            }

        sys.stdout.write(json.dumps(response, ensure_ascii=False) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()