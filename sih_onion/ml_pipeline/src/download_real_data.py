import os
import sys

try:
    from roboflow import Roboflow
except ImportError:
    print("Please install roboflow: pip install roboflow")
    sys.exit(1)

def download_dataset():
    print("==================================================")
    print("SIH26031 - Real Dataset Downloader (Roboflow)")
    print("==================================================")

    api_key = os.environ.get("ROBOFLOW_API_KEY")
    if not api_key:
        print("Error: ROBOFLOW_API_KEY environment variable not set.")
        print("Please set your API key by running:")
        print("    set ROBOFLOW_API_KEY=your_api_key (Windows CMD)")
        print("    $env:ROBOFLOW_API_KEY=\"your_api_key\" (Windows PowerShell)")
        print("    export ROBOFLOW_API_KEY=your_api_key (Linux/Mac)")
        sys.exit(1)

    # Note: Replace 'workspace-name' and 'project-name' with your actual Roboflow project details
    workspace = os.environ.get("ROBOFLOW_WORKSPACE", "your-workspace")
    project_name = os.environ.get("ROBOFLOW_PROJECT", "onion-quality-detection")
    version = int(os.environ.get("ROBOFLOW_VERSION", "1"))

    rf = Roboflow(api_key=api_key)
    try:
        project = rf.workspace(workspace).project(project_name)
        
        # Download YOLOv8 dataset format
        dataset_format = "yolov8"
        download_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "real_onions"))
        
        print(f"Downloading {workspace}/{project_name} v{version} to {download_path}...")
        dataset = project.version(version).download(dataset_format, location=download_path)
        
        print(f"\nSuccessfully downloaded dataset to {download_path}")
        print(f"Dataset YAML: {os.path.join(download_path, 'data.yaml')}")
        
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        print("Make sure your API Key, Workspace, and Project Name are correct.")

if __name__ == "__main__":
    download_dataset()
