import 'dart:convert';
import 'package:flutter/material.dart';

void main() {
  runApp(const OnionGradingApp());
}

class OnionGradingApp extends StatelessWidget {
  const OnionGradingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SIH26031 Onion Quality Assessor',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E3A8A),
          brightness: Brightness.dark,
          primary: const Color(0xFF3B82F6),
          secondary: const Color(0xFF10B981),
          surface: const Color(0xFF0F172A),
        ),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        cardTheme: CardTheme(
          color: const Color(0xFF1E293B),
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  
  // Sample evaluated batch state for live mobile demo
  Map<String, dynamic> _currentBatchData = {
    "batch_id": "BATCH_20260910_001",
    "timestamp": "2026-09-10T23:30:00",
    "operator_id": "OPERATOR_DELHI_01",
    "center_id": "AZADPUR_MANDI_DL",
    "total_count": 10,
    "grade_a_count": 8,
    "grade_a_pct": 80.0,
    "urs_count": 2,
    "urs_pct": 20.0,
    "defect_breakdown": {
      "grade_a": 8,
      "damaged": 1,
      "rotten": 0,
      "sprouted": 0,
      "undersized": 1
    },
    "onions": [
      {"id": 1, "class": "grade_a", "confidence": 0.94, "size_cm": 6.2, "flagged_for_review": false},
      {"id": 2, "class": "grade_a", "confidence": 0.91, "size_cm": 5.8, "flagged_for_review": false},
      {"id": 3, "class": "grade_a", "confidence": 0.88, "size_cm": 6.0, "flagged_for_review": false},
      {"id": 4, "class": "damaged", "confidence": 0.45, "size_cm": 5.5, "flagged_for_review": true},
      {"id": 5, "class": "grade_a", "confidence": 0.95, "size_cm": 6.5, "flagged_for_review": false},
      {"id": 6, "class": "undersized", "confidence": 0.92, "size_cm": 3.8, "flagged_for_review": false},
      {"id": 7, "class": "grade_a", "confidence": 0.89, "size_cm": 5.9, "flagged_for_review": false},
      {"id": 8, "class": "grade_a", "confidence": 0.93, "size_cm": 6.1, "flagged_for_review": false},
      {"id": 9, "class": "grade_a", "confidence": 0.90, "size_cm": 5.7, "flagged_for_review": false},
      {"id": 10, "class": "grade_a", "confidence": 0.87, "size_cm": 6.3, "flagged_for_review": false},
    ],
    "audit_trail": []
  };

  final List<Map<String, dynamic>> _historyQueue = [
    {
      "batch_id": "BATCH_20260910_001",
      "timestamp": "2026-09-10T23:30:00",
      "total_count": 10,
      "grade_a_pct": 80.0,
      "urs_pct": 20.0,
      "synced": true
    },
    {
      "batch_id": "BATCH_20260910_002",
      "timestamp": "2026-09-10T22:15:00",
      "total_count": 14,
      "grade_a_pct": 85.7,
      "urs_pct": 14.3,
      "synced": false  // Pending offline sync queue item
    }
  ];

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      CameraCaptureTab(onPhotoCaptured: _onPhotoCaptured),
      ResultsDisplayTab(
        batchData: _currentBatchData, 
        onOverrideApplied: _onOverrideApplied
      ),
      ReportViewerTab(batchData: _currentBatchData),
      HistoryTab(historyQueue: _historyQueue),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: Row(
          children: [
            const Icon(Icons.grain, color: Color(0xFF60A5FA)),
            const SizedBox(width: 10),
            const Text(
              'Onion Quality AI',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF10B981)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.wifi_off, size: 12, color: Color(0xFF10B981)),
                  SizedBox(width: 4),
                  Text('Offline-Ready', style: TextStyle(fontSize: 10, color: Color(0xFF10B981))),
                ],
              ),
            )
          ],
        ),
      ),
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        backgroundColor: const Color(0xFF1E293B),
        indicatorColor: const Color(0xFF3B82F6).withOpacity(0.3),
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.camera_alt_outlined),
            selectedIcon: Icon(Icons.camera_alt, color: Color(0xFF60A5FA)),
            label: 'Scan Lot',
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined),
            selectedIcon: Icon(Icons.analytics, color: Color(0xFF60A5FA)),
            label: 'Grading',
          ),
          NavigationDestination(
            icon: Icon(Icons.picture_as_pdf_outlined),
            selectedIcon: Icon(Icons.picture_as_pdf, color: Color(0xFF60A5FA)),
            label: 'Report',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            selectedIcon: Icon(Icons.history, color: Color(0xFF60A5FA)),
            label: 'History',
          ),
        ],
      ),
    );
  }

  void _onPhotoCaptured() {
    // Simulated lot capture trigger
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Processing image lot with YOLOv8-seg & size calibrator...'),
        backgroundColor: Color(0xFF3B82F6),
      ),
    );
    setState(() {
      _currentIndex = 1; // Switch to results screen
    });
  }

  void _onOverrideApplied(int onionId, String newClass) {
    setState(() {
      final onions = _currentBatchData["onions"] as List;
      for (var item in onions) {
        if (item["id"] == onionId) {
          item["class"] = newClass;
          item["flagged_for_review"] = false;
        }
      }
      
      // Recalculate totals
      int total = onions.length;
      int gradeA = onions.where((x) => x["class"] == "grade_a").length;
      int urs = total - gradeA;
      
      _currentBatchData["grade_a_count"] = gradeA;
      _currentBatchData["grade_a_pct"] = (gradeA / total * 100).toStringAsFixed(1);
      _currentBatchData["urs_count"] = urs;
      _currentBatchData["urs_pct"] = (urs / total * 100).toStringAsFixed(1);

      (_currentBatchData["audit_trail"] as List).add({
        "timestamp": DateTime.now().toIsoformatString(),
        "onion_id": onionId,
        "new_class": newClass,
        "reviewer_id": "OPERATOR_MOBILE"
      });
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Onion #$onionId updated to $newClass. Audit trail recorded.'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }
}


// --- TAB 1: CAMERA CAPTURE WITH ALIGNMENT GUIDE OVERLAY ---
class CameraCaptureTab extends StatelessWidget {
  final VoidCallback onPhotoCaptured;
  const CameraCaptureTab({super.key, required onPhotoCaptured}): _onPhotoCaptured = onPhotoCaptured;
  final VoidCallback _onPhotoCaptured;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Camera Viewport Simulation
        Container(
          width: double.infinity,
          height: double.infinity,
          color: Colors.black,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.filter_hdr_outlined, size: 80, color: Colors.white.withOpacity(0.15)),
                const SizedBox(height: 12),
                Text(
                  'Place Onions on Flat Surface',
                  style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 16),
                ),
              ],
            ),
          ),
        ),

        // Reference Card Overlay Guide (Top-Left)
        Positioned(
          top: 30,
          left: 20,
          child: Container(
            width: 140,
            height: 90,
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFFF59E0B), width: 2),
              borderRadius: BorderRadius.circular(8),
              color: const Color(0xFFF59E0B).withOpacity(0.15),
            ),
            child: const Center(
              child: Text(
                'ALIGN REFERENCE\nCARD HERE',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold, fontSize: 10),
              ),
            ),
          ),
        ),

        // Outer Frame Alignment Reticle
        Center(
          child: Container(
            width: MediaQuery.of(context).size.width * 0.85,
            height: MediaQuery.of(context).size.height * 0.5,
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFF3B82F6).withOpacity(0.6), width: 2),
              borderRadius: BorderRadius.circular(20),
            ),
          ),
        ),

        // Bottom Capture Control Button
        Positioned(
          bottom: 40,
          left: 0,
          right: 0,
          child: Column(
            children: [
              const Text(
                'Ensure reference card and onions are clearly visible',
                style: TextStyle(color: Colors.white70, fontSize: 12),
              ),
              const SizedBox(height: 16),
              GestureDetector(
                onTap: _onPhotoCaptured,
                child: Container(
                  width: 76,
                  height: 76,
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 4),
                  ),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF3B82F6),
                    ),
                    child: const Icon(Icons.camera_alt, color: Colors.white, size: 32),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}


// --- TAB 2: RESULTS & INTERACTIVE HUMAN-OVERRIDE TAB ---
class ResultsDisplayTab extends StatelessWidget {
  final Map<String, dynamic> batchData;
  final Function(int, String) onOverrideApplied;

  const ResultsDisplayTab({
    super.key,
    required this.batchData,
    required this.onOverrideApplied,
  });

  @override
  Widget build(BuildContext context) {
    final gradeAPct = batchData["grade_a_pct"];
    final ursPct = batchData["urs_pct"];
    final onions = batchData["onions"] as List;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // KPI Metric Summary Cards
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  'GRADE A RATIO',
                  '$gradeAPct%',
                  const Color(0xFF10B981),
                  Icons.check_circle_outline,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard(
                  'URS RATIO (REJECTED)',
                  '$ursPct%',
                  const Color(0xFFEF4444),
                  Icons.warning_amber_outlined,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Batch Info Banner
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: Color(0xFF60A5FA)),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Batch ID: ${batchData["batch_id"]}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        'Center: ${batchData["center_id"]} | Count: ${batchData["total_count"]}',
                        style: const TextStyle(color: Colors.white60, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          const Text(
            'Per-Onion Detection & Size Breakdown',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          const Text(
            'Tap any item marked [REVIEW] to manually override classification',
            style: TextStyle(fontSize: 12, color: Colors.white60),
          ),
          const SizedBox(height: 12),

          // ListView of detected items
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: onions.length,
            itemBuilder: (context, index) {
              final item = onions[index];
              final isFlagged = item["flagged_for_review"] == true;
              final cls = item["class"];
              final conf = (item["confidence"] * 100).toStringAsFixed(0);
              final size = item["size_cm"];

              return Card(
                color: isFlagged ? const Color(0xFF451A03) : const Color(0xFF1E293B),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: isFlagged ? const Color(0xFFF59E0B) : Colors.transparent,
                    width: 1.5,
                  ),
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: cls == "grade_a" 
                        ? const Color(0xFF10B981).withOpacity(0.2)
                        : const Color(0xFFEF4444).withOpacity(0.2),
                    child: Text(
                      '#${item["id"]}',
                      style: TextStyle(
                        color: cls == "grade_a" ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  title: Row(
                    children: [
                      Text(
                        cls.toString().replaceAll('_', ' ').toUpperCase(),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      if (isFlagged) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF59E0B),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'REVIEW',
                            style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 9),
                          ),
                        )
                      ]
                    ],
                  ),
                  subtitle: Text('Est. Size: $size cm | AI Confidence: $conf%'),
                  trailing: IconButton(
                    icon: const Icon(Icons.edit_outlined, color: Color(0xFF60A5FA)),
                    onPressed: () => _showOverrideBottomSheet(context, item["id"], cls),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, Color color, IconData icon) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: color),
                const SizedBox(width: 6),
                Text(label, style: const TextStyle(fontSize: 10, color: Colors.white60)),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: color),
            ),
          ],
        ),
      ),
    );
  }

  void _showOverrideBottomSheet(BuildContext context, int onionId, String currentClass) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Human Override for Onion #$onionId',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text('Current classification: $currentClass', style: const TextStyle(color: Colors.white60)),
              const SizedBox(height: 16),
              const Text('Select Corrected Category:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: ['grade_a', 'damaged', 'rotten', 'sprouted', 'undersized'].map((cat) {
                  return ChoiceChip(
                    label: Text(cat.replaceAll('_', ' ').toUpperCase()),
                    selected: currentClass == cat,
                    onSelected: (selected) {
                      Navigator.pop(context);
                      onOverrideApplied(onionId, cat);
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }
}


// --- TAB 3: PDF REPORT PREVIEW TAB ---
class ReportViewerTab extends StatelessWidget {
  final Map<String, dynamic> batchData;
  const ReportViewerTab({super.key, required this.batchData});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Icon(Icons.picture_as_pdf, size: 64, color: Color(0xFFEF4444)),
                  const SizedBox(height: 12),
                  Text(
                    'Quality Inspection PDF Report',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Batch ID: ${batchData["batch_id"]}',
                    style: const TextStyle(color: Colors.white60, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Exporting & Sharing Digital PDF Report...'),
                          backgroundColor: Color(0xFF3B82F6),
                        ),
                      );
                    },
                    icon: const Icon(Icons.share),
                    label: const Text('Export & Share PDF'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B82F6),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}


// --- TAB 4: OFFLINE HISTORY & BACKEND SYNC QUEUE TAB ---
class HistoryTab extends StatelessWidget {
  final List<Map<String, dynamic>> historyQueue;
  const HistoryTab({super.key, required this.historyQueue});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: historyQueue.length,
      itemBuilder: (context, index) {
        final item = historyQueue[index];
        final isSynced = item["synced"] == true;

        return Card(
          child: ListTile(
            leading: Icon(
              isSynced ? Icons.cloud_done : Icons.cloud_upload_outlined,
              color: isSynced ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
            ),
            title: Text(
              item["batch_id"],
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text('Grade A: ${item["grade_a_pct"]}% | URS: ${item["urs_pct"]}%'),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: isSynced 
                    ? const Color(0xFF10B981).withOpacity(0.15) 
                    : const Color(0xFFF59E0B).withOpacity(0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                isSynced ? 'SYNCED' : 'QUEUED',
                style: TextStyle(
                  color: isSynced ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                  fontWeight: FontWeight.bold,
                  fontSize: 10,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

extension DateTimeFormat on DateTime {
  String toIsoformatString() => toIso8601String();
}
